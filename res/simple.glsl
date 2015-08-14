#ifdef VERT

attribute vec3 aVertexPosition;
attribute vec2 aUV;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vUV;

void main() {

	vUV = aUV;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1);
	

}


#endif

// ---------------

#ifdef FRAG

precision highp float;

varying vec2 vUV;

uniform sampler2D uTexture;

void main() {

	gl_FragColor = vec4(texture2D(uTexture, vUV).rgb, 1);
	//gl_FragColor = vec4(vUV, 0, 1);

}


#endif