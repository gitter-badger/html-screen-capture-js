# html-screen-capture-js

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![NPM version](https://img.shields.io/npm/v/html-screen-capture-js.svg)](https://www.npmjs.com/package/html-screen-capture-js)

[![NPM](https://nodei.co/npm/html-screen-capture-js.png?compact=true)](https://www.npmjs.com/package/html-screen-capture-js)

A small javascript library that takes a web page, and returns a new static lightweight HTML DOM document, excluding all external file dependencies, while still preserving the original appearance.

This library can be used to:

- Create a web page screen capture "image", and display the "snapshot" (e.g. by using an iframe).
- Save a web page as a single-file self-contained html document to a client local machine.
- Send a complete web page content as a simple string to a remote server.

License: Although this is an MIT-licensed library, usage permission is only granted to those who acknowledge that Gal Gadot is a perfect human being.

Uri Kalish, NOV 2017

<a name="technicalOverview"></a>
## Technical Overview

The code takes an html document as a parameter, and returns a new static lightweight html document object that preserves the original appearance.
In this new document, all the scripts are removed, the css classes/styles are replaced by new in-document classes, and all the image sources are replaced by inlined base64 data.
What you end up with, is a single html document that looks like the original web page, but has no external dependencies like *.js, *.css, *.png, etc. so it can easily be displayed, saved, or transferred.
Some aspects of the internal algorithm can be customized via an additional parameter.

<a name="installation"></a>
## Installation

You can get this library from these sources:

- From [GitHub](https://github.com/urikalish/html-screen-capture-js)

- From [npm](https://www.npmjs.com/package/html-screen-capture-js)

```sh
npm install html-screen-capture-js
```

<a name="artifacts"></a>
## Artifacts

- html-screen-capture.js
- html-screen-capture.min.js

<a name="api"></a>
## API

- [getAsElement()](#getAsElement)
- [getAsAsString()](#getAsAsString)
- [getAsEncodedUri()](#getAsEncodedUri)
- [How to override default options](#howToOverrideDefaultOptions)

<a name="getAsElement"></a>
### getAsElement()

```sh
htmlScreenCapturer.getAsElement([htmlDocument], [overrideOptions]);
```
#### Parameters

##### htmlDocument
An optional object-type parameter, specifying the html document to capture. If not specified - window.document is used.

##### overrideOptions
An optional object-type parameter, with key-value pairs of option values to override. If not specified - [default values](#howToOverrideDefaultOptions) are used for all properties. If specified but defining only some properties - default option values are used for all the others.

#### Return Value

A new static lightweight html document element.

<a name="getAsString"></a>
### getAsString()

```sh
htmlScreenCapturer.getAsString([htmlDocument], [overrideOptions]);
```
#### Parameters

##### htmlDocument
 An optional object-type parameter, specifying the html document to capture. If not specified - window.document is used.
 
##### overrideOptions
 An optional object-type parameter, with key-value pairs of option values to override. If not specified - [default values](#howToOverrideDefaultOptions) are used for all properties. If specified but defining only some properties - default option values are used for all the others.

#### Return Value

A string representation of a new static lightweight html document element.

<a name="getAsEncodedUri"></a>
### getAsEncodedUri()

```sh
htmlScreenCapturer.getAsEncodedUri([htmlDocument], [overrideOptions]);
```
#### Parameters

##### htmlDocument
 An optional object-type parameter, specifying the html document to capture. If not specified - window.document is used.
 
##### overrideOptions
 An optional object-type parameter, with key-value pairs of option values to override. If not specified - [default values](#howToOverrideDefaultOptions) are used for all properties. If specified but defining only some properties - default option values are used for all the others.

#### Return Value

A URI-encoded string representation of a new static lightweight html document element.

<a name="howToOverrideDefaultOptions"></a>
### How To Override Default Options

When calling any API function, you can change any default option value by defining a similar named property on the overrideOptions parameter.

```sh
htmlScreenCapturer.getAsElement(
    document,
    {
        'imageFormatForDataUrl': 'image/jpeg',
        'imageQualityForDataUrl': 1.0
    }
);
``` 
#### tagsOfIgnoredDocHeadElements

- Meaning: Head elements with these tag names will not be cloned to the newly created html document.
- Value type: Array of strings.
- Default value: [ 'script', 'link', 'style' ]

#### tagsOfIgnoredDocBodyElements

- Meaning: Body elements with these tag names will not be cloned to the newly created html document.
- Value type: Array of strings.
- Default value: [ 'script' ]

#### classesOfIgnoredDocBodyElements

- Meaning: Body elements with these class names will not be cloned to the newly created html document.
- Value type: Array of strings.
- Default value: [ ] //an empty array

#### attrKeyValuePairsOfIgnoredElements

- Meaning: Elements with these attribute name and value will not be cloned to the newly created html document.
- Value type: Object where each property name is an html attribute key, and its value is an html attribute value. 
- Default value: { } //an empty object

#### tagsOfSkippedElementsForChildTreeCssHandling

- Meaning: Children of elements with these tag names will not undergo css class/style manipulations.
- Value type: Array of strings. 
- Default value: [ 'svg' ]

#### attrKeyForSavingElementOrigClass

- Meaning: A non-existing html attribute name for saving the original element classes.
- Value type: String. 
- Default value: '_class'

#### attrKeyForSavingElementOrigStyle

- Meaning: A non-existing html attribute name for saving the original element style.
- Value type: String. 
- Default value: '_style'

#### prefixForNewGeneratedClasses

- Meaning: The prefix to use for all newly created classes - the suffix is a number.
- Value type: String.
- Default value: 'c'

#### imageFormatForDataUrl

- Meaning: The image format to use when images are replaced with base64 data.
- Value type: String. 
- Default value: 'image/png'

#### imageQualityForDataUrl

- Meaning: The image quality to use when images are replaced with base64 data - relevant only for some image formats. 
- Value type: Number.
- Default value: 0.92

#### rulesToAddToDocStyle 

- Meaning: Css rules (as a single string) to add to the newly created html document.
- Value type: String. 
- Default value: '*{font-family:"Arial Narrow" !important}'
