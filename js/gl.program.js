/**
 * WebGL Programs (and Shaders)
 */
'use strict'


WebGL.Program = function (file, attr, uni) {

	var that = this

	function compileShader(src, type) {

		var define = type === gl.VERTEX_SHADER ? '#define VERT\n' : '#define FRAG\n'

		var shader = gl.createShader(type)
		gl.shaderSource(shader, define + src)
		gl.compileShader(shader)

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			var t = type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'
			console.error('Error compiling ' + t + ' shader. Log:')
			console.warn(gl.getShaderInfoLog(shader))

			return null
		}

		return shader

	}


	// Async load the .glsl file.
	var request = new XHR(file, function loaded() {

		var src = this.responseText

		var vertex = compileShader(src, gl.VERTEX_SHADER)
		var fragment = compileShader(src, gl.FRAGMENT_SHADER)

		if (!vertex || !fragment) {
			console.error('Unable to make program.')
			return false
		}

		var program = gl.createProgram()
		gl.attachShader(program, vertex)
		gl.attachShader(program, fragment)
		gl.linkProgram(program)


		// Attributes
		if (attr) {
			for (var a = 0; a < attr.length; a++) {
				that[attr[a]] = gl.getAttribLocation(program, attr[a])
			}
		}

		// Uniforms
		if (uni) {
			for (var u = 0; u < uni.length; u++) {
				that[uni[u]] = gl.getUniformLocation(program, uni[u])
			}
		}

		that.program = program

		// Clean up!
		gl.detachShader(program, vertex);
		gl.detachShader(program, fragment);
		gl.deleteShader(vertex);
		gl.deleteShader(fragment);

	})

	return this

}


WebGL.Program.prototype.destroy = function () {

	gl.deleteProgram(this.program)

	delete this.program

}
