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
                    return false;
                }
                return $this->next();
            }
        ],
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
        'getTranslationsStates' => function () {
            $translations = array();
            foreach (kirby()->languages() as $language) {
                $status = $this->isTranslated($language->code());
                $translations[$language->code()] = $status;
            }
            return $translations;
        },
        'hasTranslatedField' => function ($languageCode = null) {
            $languageCode = $languageCode ?? kirby()->language()->code();
            return $this->translation($languageCode)->exists() && array_key_exists('translated', $this->readContent($languageCode));
        },
        'isTranslated' => function ($languageCode = null) {
            $languageCode = $languageCode ?? kirby()->language()->code();
            if ($this->hasTranslatedField($languageCode)) {
                return $this->content($languageCode)->translated()->isNotEmpty() && $this->content($languageCode)->translated()->isTrue();
            } else {
                return false;
            }
        },
        'isUntranslated' => function ($languageCode = null) {
            return !$this->isTranslated($languageCode);
        },
        'isAvailable' => function ($languageCode = null) {
            return $this->isVisible() && $this->isTranslated($languageCode);
        },
        'isUnavailable' => function ($languageCode = null) {
            return $this->isInvisible() || $this->isUntranslated($languageCode);
        },
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
                            'translated' => $request['status']  ? 'true' : 'false'
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
