#version 300 es
precision mediump float;

uniform mat4 uMVPMatrix;

in vec3 aPosition;
in vec3 aColor;

out vec3 vColor;

void main() {
    gl_Position = uMVPMatrix * vec4(aPosition, 1.0);
    vColor = aColor;
}