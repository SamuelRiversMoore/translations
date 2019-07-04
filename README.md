# Kirby-3 translations section

A translations section to switch beween page's languages in Kirby-3 panel.

<br/>

## Installation

Download and copy this repository to `/site/plugins/translations`

Or install it with composer: `composer require samrm/translations`

<br/>

## Usage

To display the section in your page's panel, set your blueprint as follow :

```
sections:
  translations:
    headline: Translations
    type: translations
```

The section check if the page has a `translated` status of `true` or `false`.

To manage this status, add a Boolean field in your blueprint :

```
sections:
  type: fields
  fields:
    translated:
      type: toggle
      label: Translation status
      text: This translation is complete
      default: false
```
