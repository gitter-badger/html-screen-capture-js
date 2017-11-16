class Capturer {
	constructor() {
		this._options = {
			tagsToRemoveFromDocHead: ['script', 'link', 'style'],
			tagsToRemoveFromDocBody: ['script'],
			attributeKeyValuePairsOfElementsToRemove: {},
			tagsToSkipCssHandlingForChildTree: ['svg'],
			attributeForSavingElmOrigClass: '_class',
			attributeForSavingElmOrigStyle: '_style',
			prefixForNewGeneratedClasses: 'c',
			imageFormatForDataUrl: 'image/png',
			imageQualityForDataUrl: '0.92',
			rulesToInjectToDocStyle: '*{font-family:"Arial Narrow" !important;}'
		};
		this._isHead = true;
		this._classMap = {};
		this._classCount = 0;
		this._shouldHandleImgDataUrl = true;
		this._canvas = null;
		this._ctx = null;
		this._doc = null;
	}
	_getImgDataUrl(imgElm) {
		let imgDataUrl = '';
		try {
			if (!this._canvas) {
				this._canvas = this._doc.createElement('canvas');
				this._ctx = this._canvas.getContext('2d');
			}
			this._canvas.width = imgElm.clientWidth;
			this._canvas.height = imgElm.clientHeight;
			this._ctx.drawImage(imgElm, 0, 0);
			imgDataUrl = this._canvas.toDataURL(this._options.imageFormatForDataUrl, this._options.imageQualityForDataUrl);
		} catch(ex) {
			console.log('Capturer.getImgDataUrl() - ' + ex.message);
			this._shouldHandleImgDataUrl = false;
		}
		return imgDataUrl;
	}
	_getClassCount(domElm) {
		let classes = domElm.className instanceof SVGAnimatedString ? domElm.className.baseVal : domElm.className;
		return classes ? classes.split(' ').length : 0;
	}
	_getClassName(domElm) {
		let classes = domElm.className;
		return classes instanceof SVGAnimatedString ? classes.baseVal : classes;
	}
	_handleElmCss(domElm, newElm) {
		if (this._getClassCount(newElm) > 0) {
			if (this._options.attributeForSavingElmOrigClass) {
				newElm.setAttribute(this._options.attributeForSavingElmOrigClass, this._getClassName(newElm));
			}
			newElm.removeAttribute('class');
		}
		if (newElm.getAttribute('style')) {
			if (this._options.attributeForSavingElmOrigStyle) {
				newElm.setAttribute(this._options.attributeForSavingElmOrigStyle, newElm.getAttribute('style'));
			}
			newElm.removeAttribute('style');
		}
		let computedStyle = getComputedStyle(domElm);
		let classStr = '';
		for (let i = 0; i < computedStyle.length; i++) {
			let property = computedStyle.item(i);
			let value = computedStyle.getPropertyValue(property);
			let mapKey = property + ':' + value;
			let className = this._classMap[mapKey];
			if (!className) {
				this._classCount++;
				className = (this._options.prefixForNewGeneratedClasses ? this._options.prefixForNewGeneratedClasses : 'c') + this._classCount;
				this._classMap[mapKey] = className;
			}
			classStr += (className + ' ');
		}
		if (classStr) {
			newElm.setAttribute('class', classStr.trim());
		}
	}
	_appendNewStyle(newHtml) {
		let style = this._doc.createElement('style');
		style.type = 'text/css';
		let cssText = this._options.rulesToInjectToDocStyle || '';
		for (let def in this._classMap) {
			if (this._classMap.hasOwnProperty(def)) {
				cssText += ('.' + this._classMap[def] + '{' + def + ';}');
			}
		}
		if (style.styleSheet) {
			style.styleSheet.cssText = cssText;
		} else {
			style.appendChild(this._doc.createTextNode(cssText));
		}
		newHtml.children[0].appendChild(style);
	}
	_shouldRemoveElm(domElm) {
		let shouldRemoveElm = false;
		if (this._isHead && this._options.tagsToRemoveFromDocHead && this._options.tagsToRemoveFromDocHead.indexOf(domElm.tagName.toLowerCase()) > -1 ||
		   !this._isHead && this._options.tagsToRemoveFromDocBody && this._options.tagsToRemoveFromDocBody.indexOf(domElm.tagName.toLowerCase()) > -1) {
			shouldRemoveElm = true;
		} else if (this._options.attributeKeyValuePairsOfElementsToRemove) {
			for (let attrKey in this._options.attributeKeyValuePairsOfElementsToRemove) {
				if (this._options.attributeKeyValuePairsOfElementsToRemove.hasOwnProperty(attrKey)) {
					for (let i = 0; i < domElm.attributes.length; i++) {
						if (domElm.attributes[i].specified && domElm.attributes[i].value === this._options.attributeKeyValuePairsOfElementsToRemove[attrKey]) {
							shouldRemoveElm = true;
						}
					}
				}
			}
		}
		return shouldRemoveElm;
	}
	_recursiveWalk(domElm, newElm, handleCss) {
		if (this._shouldHandleImgDataUrl && !this._isHead && domElm.tagName.toLowerCase() === 'img') {
			let imgDataUrl = this._getImgDataUrl(domElm);
			if (imgDataUrl) {
				newElm.setAttribute('src', imgDataUrl);
			}
		}
		if (handleCss) {
			this._handleElmCss(domElm, newElm);
			if (this._options.tagsToSkipCssHandlingForChildTree && this._options.tagsToSkipCssHandlingForChildTree.indexOf(domElm.tagName.toLowerCase()) > -1) {
				handleCss = false;
			}
		}
		if (domElm.children) {
			for (let i = domElm.children.length - 1; i >= 0; i--) {
				if (this._shouldRemoveElm(domElm.children[i])) {
					newElm.removeChild(newElm.children[i]);
				} else {
					this._recursiveWalk(domElm.children[i], newElm.children[i], handleCss);
				}
			}
		}
	}
	_createNewHtml() {
		let newHtml = this._doc.documentElement.cloneNode(false);
		this._handleElmCss(this._doc.documentElement, newHtml);
		return newHtml;
	}
	_appendNewHead(newHtml) {
		let newHead = this._doc.head.cloneNode(true);
		this._isHead = true;
		this._recursiveWalk(this._doc.head, newHead, false);
		newHtml.appendChild(newHead);
	}
	_appendNewBody(newHtml) {
		let newBody = this._doc.body.cloneNode(true);
		this._isHead = false;
		this._recursiveWalk(this._doc.body, newBody, true);
		newHtml.appendChild(newBody);
	}
	_init() {
		this._isHead = true;
		this._classMap = {};
		this._classCount = 0;
		this._shouldHandleImgDataUrl = true;
		this._canvas = null;
		this._ctx = null;
	}
	_getNewHtml() {
		this._init();
		let newHtml = this._createNewHtml();
		this._appendNewHead(newHtml);
		this._appendNewBody(newHtml);
		this._appendNewStyle(newHtml);
		return newHtml;
	}
	getAsHtmlElement(htmlDocument, overrideOptions) {
		this._doc = htmlDocument || document;
		if (overrideOptions) {
			for (let def in overrideOptions) {
				if (overrideOptions.hasOwnProperty(def)) {
					this._options[def] = overrideOptions[def];
				}
			}
		}
		return this._getNewHtml();
	}
}

class HtmlScreenCapturer {
	constructor() {
		this._capturer = new Capturer();
		this._functionStartTime = null;
	}
	_onFunctionStart(functionName) {
		this._functionStartTime = (new Date()).getTime();
		console.log(`HtmlScreenCapturer.${functionName}() - start`);
	}
	_onFunctionEnd(functionName) {
		let endTime = (new Date()).getTime();
		console.log(`HtmlScreenCapturer.${functionName}() - end - ${endTime - this._functionStartTime}ms`);
	}
	static _onFunctionException(functionName, ex) {
		console.error(`HtmlScreenCapturer.${functionName}() - error - ${ex.message}`);
	}
	getAsHtmlElement(htmlDocument, overrideOptions) {
		this._onFunctionStart('getAsHtmlElement');
		try {
			return this._capturer.getAsHtmlElement(htmlDocument, overrideOptions);
		} catch(ex) {
			HtmlScreenCapturer._onFunctionException('getAsHtmlElement', ex);
		} finally {
			this._onFunctionEnd('getAsHtmlElement');
		}
	}
	getAsHtmlString(htmlDocument, overrideOptions) {
		this._onFunctionStart('getAsHtmlString');
		try {
			return this._capturer.getAsHtmlElement(htmlDocument, overrideOptions).outerHTML;
		} catch(ex) {
			HtmlScreenCapturer._onFunctionException('getAsHtmlString', ex);
		} finally {
			this._onFunctionEnd('getAsHtmlString');
		}
	}
}

module.exports = new HtmlScreenCapturer();
