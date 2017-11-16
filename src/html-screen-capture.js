class Capturer {
	constructor() {
		this._options = {
			tagsToIgnoreFromDocHead: ['script', 'link', 'style'],
			tagsToIgnoreFromDocBody: ['script'],
			classesOfElementsToIgnore: [],
			attributeKeyValuePairsOfElementsToIgnore: {},
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
	_getClasses(domElm) {
		let classes = [];
		let className = domElm.className instanceof SVGAnimatedString ? domElm.className.baseVal : domElm.className;
		if (className) {
			let classNames = className.split(' ');
			classNames.forEach(c => {
				if (c) {
					classes.push(c);
				}
			});
		}
		return classes;
	}
	_getClassName(domElm) {
		let classes = domElm.className;
		return classes instanceof SVGAnimatedString ? classes.baseVal : classes;
	}
	_handleElmCss(domElm, newElm) {
		if (this._getClasses(newElm).length > 0) {
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
	_shouldIgnoreElm(domElm) {
		let shouldRemoveElm = false;
		if (this._isHead && this._options.tagsToIgnoreFromDocHead && this._options.tagsToIgnoreFromDocHead.indexOf(domElm.tagName.toLowerCase()) > -1 ||
		   !this._isHead && this._options.tagsToIgnoreFromDocBody && this._options.tagsToIgnoreFromDocBody.indexOf(domElm.tagName.toLowerCase()) > -1) {
			shouldRemoveElm = true;
		}
		if (!shouldRemoveElm && this._options.attributeKeyValuePairsOfElementsToIgnore) {
			for (let attrKey in this._options.attributeKeyValuePairsOfElementsToIgnore) {
				if (this._options.attributeKeyValuePairsOfElementsToIgnore.hasOwnProperty(attrKey)) {
					for (let i = 0; i < domElm.attributes.length; i++) {
						if (domElm.attributes[i].specified && domElm.attributes[i].value === this._options.attributeKeyValuePairsOfElementsToIgnore[attrKey]) {
							shouldRemoveElm = true;
						}
					}
				}
			}
		}
		if (!shouldRemoveElm && this._options.classesOfElementsToIgnore) {
			let domElmClasses = this._getClasses(domElm);
			domElmClasses.forEach(c => {
				if (!shouldRemoveElm && this._options.classesOfElementsToIgnore.indexOf(c) > -1) {
					shouldRemoveElm = true;
				}
			})
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
				if (this._shouldIgnoreElm(domElm.children[i])) {
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
		this._objectName = 'HtmlScreenCapturer';
		this._capturer = new Capturer();
		this._functionStartTime = (new Date()).getTime();
	}
	_runApiFunction(func, args, apiFuncName) {
		this._functionStartTime = (new Date()).getTime();
		console.log(`${this._objectName}.${apiFuncName}() - start`);
		let retVal = null;
		try {
			retVal = func.call(this, args);
		} catch(ex) {
			console.error(`${this._objectName}.${apiFuncName}() - error - ${ex.message}`);
		} finally {
			let endTime = (new Date()).getTime();
			console.log(`${this._objectName}.${apiFuncName}() - end - ${endTime - this._functionStartTime}ms`);
		}
		return retVal;
	}
	getAsElement(htmlDocument, overrideOptions) {
		return this._runApiFunction(function(args) {
			return this._capturer.getAsHtmlElement(...args);
		}, [htmlDocument, overrideOptions], 'getAsElement');
	}
	getAsString(htmlDocument, overrideOptions) {
		return this._runApiFunction(function(args) {
			let htmlElement = this._capturer.getAsHtmlElement(...args);
			return htmlElement ? htmlElement.outerHTML : '';
		}, [htmlDocument, overrideOptions], 'getAsString');
	}
	getAsEncodedUri(htmlDocument, overrideOptions) {
		return this._runApiFunction(function(args) {
			let htmlElement = this._capturer.getAsHtmlElement(...args);
			return htmlElement ? encodeURI(htmlElement.outerHTML) : '';
		}, [htmlDocument, overrideOptions], 'getAsEncodedUri');
	}
}

module.exports = new HtmlScreenCapturer();
