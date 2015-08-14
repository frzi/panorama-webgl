/**
 * Main initialization.
 */
'use strict'


Math.clamp = Math.clamp || function (val, min, max) {
	return Math.min( Math.max(min, val), max )
}


function init(event) {

	// Initialize components.

	// Initialize WebGL
	WebGL.init()
	document.body.appendChild(gl.canvas)

	sample = new WebGL.Texture('res/android_panorama.jpg')

	simple = new WebGL.Program('res/simple.glsl',
		['aVertexPosition', 'aUV'], ['uMVMatrix', 'uPMatrix', 'uTexture'])

	resize()


	gl.canvas.addEventListener('click', function (ev) {
		this.webkitRequestFullscreen()
	})

	gl.canvas.addEventListener('touchstart', function (ev) {
		if (ev.touches.length >= 3) {
			this.webkitRequestFullscreen()
		}
	})

}


function resize() {

	gl.canvas.width = innerWidth
	gl.canvas.height = innerHeight

}



addEventListener('DOMContentLoaded', init)

addEventListener('resize', resize)


// Mouse
addEventListener('mousedown', function (ev) {
	ev.preventDefault()

	rotation.startX = ev.clientX
	rotation.startY = ev.clientY

	rotation.deltaX = 0
	rotation.deltaY = 0

	return false
})


addEventListener('mousemove', function (ev) {
	ev.preventDefault()

	if (rotation.startX || rotation.startY) {
		rotation.deltaX = (ev.clientX - rotation.startX) * rotation.sensitivity
		rotation.deltaY = (ev.clientY - rotation.startY) * rotation.sensitivity

		rotation.startX = ev.clientX
		rotation.startY = ev.clientY
	}

	return false
})


addEventListener('mouseup', function (ev) {
	rotation.startX = 0
	rotation.startY = 0
})



// Touches
addEventListener('touchstart', function (ev) {
	ev.preventDefault()

	rotation.startX = ev.touches[0].clientX
	rotation.startY = ev.touches[0].clientY

	rotation.deltaX = 0
	rotation.deltaY = 0

	return false
})


addEventListener('touchmove', function (ev) {
	ev.preventDefault()

	if (rotation.startX || rotation.startY) {
		rotation.deltaX = (ev.touches[0].clientX - rotation.startX) * rotation.sensitivity
		rotation.deltaY = (ev.touches[0].clientY - rotation.startY) * rotation.sensitivity

		rotation.startX = ev.touches[0].clientX
		rotation.startY = ev.touches[0].clientY
	}

	return false
})


function touchEnd(ev) {
	rotation.startX = 0
	rotation.startY = 0
}

addEventListener('touchend', touchEnd)
addEventListener('touchcancel', touchEnd)

