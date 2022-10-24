<?php

Kirby::plugin('samrm/translations', [
    'options' => [
        'routing' => false
    ],
    'routes' => [
        [
            'pattern' => '(:all)',
            'language' => '*',
            'action' => function ($language, $slug) {
                $page = site()->visit($slug, $language->code());
                if (option('samrm.translations.routing') && $page->isUntranslated() && !kirby()->user()) {
                    return page('error')->render(['message' => 'This page has not been translated yet.']);
                }
                return $this->next();
            }
        ],
    ],
    'siteMethods' => [
        'getTranslationsIndex' => function ($page = null) {
            $root = $page ?? $this;
            $translations = array();
            foreach ($root->index() as $child) {
                $translations[] = array(
                    'title' => $child->title()->value(),
                    'depth' => $child->depth() - 1,
                    'image' => $child->panel()->image(),
                    'panelUrl' => $child->panel()->url(true),
                    'breadcrumbs' => $child->getBreadcrumbsAsString(),
                    'translations' => $child->getTranslationsStates()
                );
            }
            return $translations;
        },
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
        'hasTranslated' => function () {
            return $this->translated()->count() > 0;
        },
        'hasAvailable' => function () {
            return $this->available()->count() > 0;
        },
    ],
    'pageMethods' => [
        'getTranslationsStates' => function () {
            $translations = array();
            foreach (kirby()->languages() as $language) {
                $translations[$language->code()] = $this->getTranslatedStatus($language->code());
            }
            return $translations;
        },
        'getTranslationsIndex' => function () {
            return site()->getTranslationsIndex($this);  
        },
        'hasTranslatedField' => function ($languageCode = null) {
            $languageCode = $languageCode ?? kirby()->language()->code();
            return $this->translation($languageCode)->exists() && array_key_exists('translated', $this->readContent($languageCode));
        },
        'isTranslated' => function ($languageCode = null) {
            $languageCode = $languageCode ?? kirby()->language()->code();
            return $this->getTranslatedStatus($languageCode) == 'true';
        },
        'isPending' => function ($languageCode = null) {
            $languageCode = $languageCode ?? kirby()->language()->code();
            return $this->getTranslatedStatus($languageCode) == 'pending';
        },
        'isUntranslated' => function ($languageCode = null) {
            $languageCode = $languageCode ?? kirby()->language()->code();
            return $this->getTranslatedStatus($languageCode) == 'false';
        },
        'getTranslatedStatus' => function ($languageCode = null) {
            $languageCode = $languageCode ?? kirby()->language()->code();
            if ($this->hasTranslatedField($languageCode) && $this->content($languageCode)->translated()->isNotEmpty()) {
                return $this->content($languageCode)->translated()->value();
            } else {
                return 'false';
            }
        },
        'isAvailable' => function ($languageCode = null) {
            return $this->isListed() && ($this->isTranslated($languageCode) || $this->isPending($languageCode));
        },
        'isUnavailable' => function ($languageCode = null) {
            return $this->isInvisible() || $this->isUntranslated($languageCode);
        },
        'getBreadcrumbsAsString' => function () {
            $crumbs = $this->parents()->flip()->pluck('title');
            return implode("&ensp;>&ensp;", $crumbs);
        }
    ],
    'sections' => [
        'translations' => [
            'props' => [
                'headline' => function ($headline) {
                    return $headline;
                },
            ],
            'computed' => [
                'translations' => function () {
                    return $this->model()->getTranslationsStates();
                }
            ]
        ],
        'translationsindex' => [
            'props' => [
                'headline' => function ($headline) {
                    return $headline;
                },
            ],
            'computed' => [
                'index' => function () {
                    return $this->model()->getTranslationsIndex();
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
                            'translated' => $request['status']  ?  $request['status'] : 'false'
                        ], $request['languageCode']);
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
