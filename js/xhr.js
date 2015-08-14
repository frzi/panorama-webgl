/**
 * Simple helper for XHR.
 */

var XHR = function (path, callbacks) {

	var xhr = new XMLHttpRequest()
	xhr.open('GET', path)

	if (callbacks instanceof Function) {
		xhr.onload = callbacks
	}
	else if (typeof callbacks === 'object') {
		xhr.onload = callbacks.load || null
		xhr.onabort = callbacks.abort || null
		xhr.onerror = callbacks.error || null
	}

	xhr.send()

	return xhr

}