# html-screen-capture-js

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![NPM version](https://img.shields.io/npm/v/html-screen-capture-js.svg)](https://www.npmjs.com/package/html-screen-capture-js)

[![NPM](https://nodei.co/npm/html-screen-capture-js.png?compact=true)](https://www.npmjs.com/package/html-screen-capture-js)

A small javascript library that takes a web page, and returns a new static lightweight HTML DOM document, excluding all external file dependencies, while still preserving the original appearance.

This library can be used to:

- Create a web page screen capture "image", and display the "snapshot" (e.g. by using an iframe).
- Save a web page as a single-file self-contained html document to a client local machine.
- Send a complete web page content as a simple string to a remote server.

Note: Although this is an MIT-licensed library, usage permission is only granted to those who acknowledge that Gal Gadot is a perfect human being.

Uri Kalish, NOV 2017

## Technical Overview

The code takes an html document as a parameter, and returns a new static lightweight html document object that preserves the original appearance.
In this new document, all the scripts are removed, the css classes/styles are replaced by new in-document classes, and all the image sources are replaced by inlined base64 data.
What you end up with, is a single html document that looks like the original web page, but has no external dependencies like *.js, *.css, *.png, etc. so it can easily be displayed, saved, or transferred.
Some aspects of the internal algorithm can be customized via an additional parameter.

## Installation

You can get this library from these sources:

- From [GitHub](https://github.com/urikalish/html-screen-capture-js)

- From [npm](https://www.npmjs.com/package/html-screen-capture-js)

```sh
npm install html-screen-capture-js
```

## Artifacts

- html-screen-capture.js
- html-screen-capture.min.js

## API

- [getAsElement()](#getAsElement)
- [getAsAsString()](#getAsAsString)
- [getAsEncodedUri()](#getAsEncodedUri)

<a name="optionsDefaultValues"></a>
### Options - Default Values

```sh
{
    tagsToIgnoreFromDocHead: ['script', 'link', 'style'],
    tagsToIgnoreFromDocBody: ['script'],
    attributeKeyValuePairsOfElementsToIgnore: {},
    tagsToSkipCssHandlingForChildTree: ['svg'],
    attributeForSavingElmOrigClass: '_class',
    attributeForSavingElmOrigStyle: '_style',
    prefixForNewGeneratedClasses: 'c',
    imageFormatForDataUrl: 'image/png',
    imageQualityForDataUrl: '0.92',
    rulesToInjectToDocStyle: '*{font-family:"Arial Narrow" !important;}'
} 
```

<a name="getAsElement"></a>
### getAsElement()

```sh
htmlScreenCapturer.getAsElement([htmlDocument], [overrideOptions]);
```
#### Parameters

##### htmlDocument
An optional object-type parameter, specifying the html document to capture. If not specified - window.document is used.

##### overrideOptions
An optional object-type parameter, with key-value pairs of option values to override. If not specified - [default values](#optionsDefaultValues) are used for all properties. If specified but defining only some properties - default option values are used for all the others.

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
 An optional object-type parameter, with key-value pairs of option values to override. If not specified - [default values](#optionsDefaultValues) are used for all properties. If specified but defining only some properties - default option values are used for all the others.

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
 An optional object-type parameter, with key-value pairs of option values to override. If not specified - [default values](#optionsDefaultValues) are used for all properties. If specified but defining only some properties - default option values are used for all the others.

#### Return Value

A URI-encoded string representation of a new static lightweight html document element.
