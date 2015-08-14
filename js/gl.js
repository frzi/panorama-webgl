/**
 * WebGL wrapper for the requirectangular panorama.
 * This thing is in no way universal and is made specifically for the panorama.
 * So don't copy this stuff for future projects. :-)
 */
'use strict'


var sphereSegsX = 60
var sphereSegsY = 40


// Global vars
var gl, simple, sphere, sample

var projection = mat4.create()
var modelView = mat4.create()

var rotation = {
	x: 0, y: 0, z: 0,
	deltaX: 0, deltaY: 0,
	startX: 0, startY: 0,
	deceleration: 0.8,
	sensitivity: 0.2
}

var WebGL = {}


WebGL.init = function (canvas) {

	var dom = canvas || document.createElement('canvas')

	var options = {
		antialias : true,
		stencil : false,
		depth : true
	}

	gl = dom.getContext('webgl', options)


	// Configure
	gl.clearColor(0, 0, 0, 1)
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

	/**
	 * TEST.
	 * Make the sphere a quad. FOR NOW.
	 * Keep in mind it's interleaved! :-)
	 * b - d
	 * | \ |
	 * a - c
	 */
	var vertices = new Float32Array([
		-1, -1, 0, 0, 0, // a
		-1, 1, 0, 0, 1, // b
		1, -1, 0, 1, 0, // c
		-1, 1, 0, 0, 1, // b
		1, -1, 0, 1, 0, // c
		1, 1, 0, 1, 1 // d
		])
	// ----------------

	vertices = WebGL.generateSphere(sphereSegsX, sphereSegsY)

	sphere = gl.createBuffer(gl.ARRAY_BUFFER)
	gl.bindBuffer(gl.ARRAY_BUFFER, sphere)
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

	WebGL.update()

	return this

}



WebGL.update = function () {

	mat4.perspective(projection, 70, window.innerWidth / window.innerHeight, 2, 1000 )

	if (Math.abs(rotation.deltaX) > 0.01) 
		rotation.deltaX *= rotation.deceleration
	else rotation.deltaX = 0

	if (Math.abs(rotation.deltaY) > 0.01)
		rotation.deltaY *= rotation.deceleration
	else rotation.deltaY = 0

	rotation.x += rotation.deltaX
	rotation.y += rotation.deltaY

	rotation.y = Math.clamp(rotation.y, -85, 85)
	

	mat4.identity(modelView)
	mat4.translate(modelView, modelView, [0, 0, -30])
	mat4.scale(modelView, modelView, [-100, 100, 100])

	mat4.rotate(modelView, modelView, -rotation.y * (Math.PI / 180), [1, 0, 0])
	mat4.rotate(modelView, modelView, rotation.x * (Math.PI / 180), [0, 1, 0])

	
	WebGL.draw()

	requestAnimationFrame(WebGL.update)

}



WebGL.draw = function () {

	if (!simple || !simple.program)
		return

	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	gl.useProgram(simple.program)

	var stride = 5 * 4

	gl.uniformMatrix4fv(simple.uPMatrix, 0, projection)
	gl.uniformMatrix4fv(simple.uMVMatrix, 0, modelView)
	gl.uniform1i(simple.uTexture, 0)

	gl.bindBuffer(gl.ARRAY_BUFFER, sphere)
	gl.vertexAttribPointer(simple.aVertexPosition, 3, gl.FLOAT, false, stride, 0)
	gl.enableVertexAttribArray(simple.aVertexPosition)

	gl.vertexAttribPointer(simple.aUV, 2, gl.FLOAT, false, stride, 3 * 4)
	gl.enableVertexAttribArray(simple.aUV)

	gl.drawArrays(gl.TRIANGLES, 0, sphereSegsX * sphereSegsY * 6)

}



WebGL.generateSphere = function (widthSeg, heightSeg) {

	widthSeg = Math.max(3, (widthSeg | 0) || 3)
	heightSeg = Math.max(3, (heightSeg | 0) || 3)


	var x, y, vertices = [], uvs = []


	for (y = 0; y <= heightSeg; y++) {

		var vertRow = []
		var uvRow = []

		for (x = 0; x <= widthSeg; x++) {

			var u = x / widthSeg
			var v = y / heightSeg

			var vx = -(Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI))
			var vy = Math.cos(v * Math.PI)
			var vz = Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI)

			vertRow.push([vx, vy, vz])
			uvRow.push([u, 1 - v])

		}

		vertices.push(vertRow)
		uvs.push(uvRow)

	}


	var data = []


	for (y = 0; y < heightSeg; y++) {

		for (x = 0; x < widthSeg; x++) {

			var v1 = vertices[y][x]
			var v2 = vertices[y][x + 1]
			var v3 = vertices[y + 1][x]
			var v4 = vertices[y + 1][x + 1]

			var uv1 = uvs[y][x]
			var uv2 = uvs[y][x + 1]
			var uv3 = uvs[y + 1][x]
			var uv4 = uvs[y + 1][x + 1]

			// First triangle
			data.push(v2[0], v2[1], v2[2], uv2[0], uv2[1])
			data.push(v1[0], v1[1], v1[2], uv1[0], uv1[1])
			data.push(v3[0], v3[1], v3[2], uv3[0], uv3[1])
			
			// Second triangle
			data.push(v2[0], v2[1], v2[2], uv2[0], uv2[1])
			data.push(v4[0], v4[1], v4[2], uv4[0], uv4[1])
			data.push(v3[0], v3[1], v3[2], uv3[0], uv3[1])

		}

	}

	var buffer = new Float32Array(data)
	console.log(buffer.length / 5)

	return buffer

}