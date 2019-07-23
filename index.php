<?php

Kirby::plugin('samrm/translations', [
    'routes' => [
        [
            'pattern' => '(:all)',
            'language' => '*',
            'action' => function ($language, $slug) {
                $page = site()->visit($slug, $language->code());
                if ($page->isUntranslated() && !kirby()->user()) {
                    return false;
                }
                return $this->next();
            }
        ],
    ],
    'hooks' => [
        'page.update:before' => function ($page) {
            // set a default value of the "translated" field for every tranlation of article or country pages
            try {
                if (in_array($page->intendedTemplate(), array('country', 'article'))) {
                    foreach ($this->languages() as $language) {
                        if ($this->language()->code() != $language->code()) {
                            if (!$page->content($language->code())->translated() || $page->content($language->code())->translated()->isEmpty()) {
                                $page->update([
                                    'translated' => 'false' // default value
                                ], $language->code());
                            }
                        }
                    }
                }
            } catch (Exception $e) {
                echo $e->getMessage();
            }
        }
    ],
    'pagesMethods' => [
        'translated' => function () {
            return $this->filter(function ($page) {
                return $page->isTranslated();
            });
        },
        'available' => function () {
            return $this->filter(function ($page) {
                return $page->isAvailable();
            });
        },
    ],
    'pageMethods' => [
        'isTranslated' => function () {
            $language = kirby()->language()->code();
            return $this->content($language)->translated()->isEmpty() || $this->content($language)->translated()->isTrue();
        },
        'isUntranslated' => function () {
            return !$this->isTranslated();
        },
        'isAvailable' => function () {
            return $this->isVisible() && $this->isTranslated();
        },
        'isUnavailable' => function () {
            return $this->isInvisible() && $this->isUntranslated();
        }
    ],
    'sections' => [
        'translations' => [
            'props' => [
                'headline' => function ($headline) {
                    return $headline;
                },
                'field' => function ($field = 'translated') {
                    return $field;
                },
            ],
            'computed' => [
                'translations' => function () {
                    $translations = array();
                    foreach ($this->model()->kirby()->languages() as $language) {
                        $field = $this->field;
                        $status = $this->model()->content($language->code())->$field();
                        $translations[$language->code()] = $status->toBool();
                    }
                    return $translations;
                }
            ]
        ]
    ],
    'api' => [
        'routes' => [
            [
                'pattern' => 'set-translation-status',
                'method'  => 'POST',
                'auth' => true,
                'action'  => function () {
                    $request = $this->requestBody();
                    try {
                        $page = $this->kirby()->page($request['pageId']);
                        $page->update([
                            'translated' => $request['status']
                        ], $request['lang']);
                        return [
                            'status' => 'success',
                            'value' => $request['status']
                        ];
                    } catch (Exception $e) {
                        return [
                            'status' => 'error',
                            'message' => $e->getMessage()
                        ];
                    }
                }
            ]
        ]
    ],
]);
