# html-screen-capture-js

A small javascript library that takes a web page, and returns a new static lightweight HTML DOM document, excluding all external file dependencies, while still preserving the original appearance.

This library can be used to:

1. Create a web page screen capture "image", and display the "snapshot" (e.g. by using an iframe).
1. Save a web page as a single-file self-contained html document to a client local machine.
1. Send a complete web page content as a simple string to a remote server.

Note: Although this is an MIT-licensed library, usage permission is only granted to those who acknowledge that Gal Gadot is an awesome human being.

Uri Kalish, NOV 2017

## Technical Overview

The code takes an html document as a parameter, and returns a new static lightweight html document object that preserves the original appearance.
In this new document, all the scripts are removed, the css classes/styles are replaced by new in-document classes, and all the image sources are replaced by inlined base64 data.
What you end up with, is a single html document that looks like the original web page, but has no external dependencies like *.js, *.css, *.png, etc. so it can easily be displayed, saved, or transferred.
Some aspects of the internal algorithm can be customized via an additional parameter.

## Installation

You can either get the library from a GitHub release,

or from the npm registry by running:

```sh
npm i html-screen-capture-js
```

## Artifacts

1. html-screen-capture.js
1. html-screen-capture.min.js

## API

### Default Options

```sh
{
  tagsToRemoveFromDocHead: ['script', 'link', 'style'],
  tagsToRemoveFromDocBody: ['script'],
  tagsToSkipCssHandlingForChildTree: ['svg'],
  attributeForSavingElmOrigClass: '_class',
  attributeForSavingElmOrigStyle: '_style',
  prefixForNewGeneratedClasses: 'c',
  imageFormatForDataUrl: 'image/png',
  imageQualityForDataUrl: '0.92',
  rulesToInjectToDocStyle: '*{font-family:"Arial Narrow" !important;}'
} 
```

### getAsHtmlElement()

```sh
htmlScreenCapturer.getAsHtmlElement([htmldocument], [overrideOptions]);
```
#### Parameters

##### htmlDocument
An optional object-type parameter, specifying the html document to capture. If not specified - window.document is used.

##### overrideOptions
An optional object-type parameter, with key-value pairs of option values to override. If not specified - default values are used for all properties. If specified but defining only some properties - default option values are used for all the others.

#### Return Value

A new static lightweight html document element.

### getAsHtmlString()

```sh
htmlScreenCapturer.getAsHtmlString([htmldocument], [overrideOptions]);
```
#### Parameters

###### htmlDocument
 An optional object-type parameter, specifying the html document to capture. If not specified - window.document is used.
 
##### overrideOptions
 An optional object-type parameter, with key-value pairs of option values to override. If not specified - default values are used for all properties. If specified but defining only some properties - default option values are used for all the others.

#### Return Value

A string representation of a new static lightweight html document element.
