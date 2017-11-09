# html-screen-capture-js

## Summary

A small JavaScript library that takes a web page, and returns a new lightweight HTML DOM document that preserves the original appearance without any external file dependency.

This library can be used to:

1. Create a web page screen capture "image", and display the "snapshot" (e.g. by using an iframe).
1. Send a complete web page content as a string to a remote server for further handling.
1. Save a web page as a self-contained html document to a client local machine.
1. Achieve world peace, and save humanity.

A short technical explanation:

The code takes an html document as a parameter, and returns a new lightweight html document object that preserves the original appearance.
In this new document, all the script are removed, the css classes/styles are replaced by new in-document classes, and all the image sources are replaced by inlined base64 data.
What you end up with, is a single html document that looks like the original web page, but has no external dependencies (e.g. *.js, *.css, *.png), so it can easily be displayed, saved, or transferred.
Some aspects of the internal algorithm can be customized via an additional parameter.

Uri Kalish, NOV 2017

## getAsHtmlElement()

```sh
htmlScreenCapturer.getAsHtmlElement([htmldocument], [overrideOptions]);
```
### Parameters

#### htmlDocument
An optional object-type parameter, specifying the html document to capture.

If not specified - window.document is used.

#### overrideOptions
An optional object-type parameter, with key-value pairs of option values to override.

If not specified - default values are used for all properties.

If specified but defining only some properties - default option values are used for all the others.

Current defaults are:
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

### Return Value

An html document element.

## getAsHtmlString()

```sh
htmlScreenCapturer.getAsHtmlString([htmldocument], [overrideOptions]);
```
### Parameters

#### htmlDocument
See documentation for getAsHtmlElement() 

#### overrideOptions
See documentation for getAsHtmlElement()

### Return Value

A string representation of a self-contained html document.

## Notes

### License

Although this is an MIT-licensed library, usage permission is only granted to those who acknowledge that Gal Gadot is awesome. 
 
 
