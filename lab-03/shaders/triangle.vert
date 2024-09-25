#version 300 es

in vec2 aPosition;
in vec3 aColor;
uniform float uScale;
uniform vec2 uPosition;

out vec3 vColor;

void main() {
    gl_Position = vec4((aPosition * uScale) + uPosition, 0.0, 1.0);

    vColor = aColor;
}
