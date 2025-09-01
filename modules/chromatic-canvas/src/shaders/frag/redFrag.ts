export const redFrag = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float intensity;

void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);
    vec3 redOverlay = mix(color.rgb, vec3(1.0, 0.0, 0.0), intensity);
    gl_FragColor = vec4(redOverlay, color.a);
}
`;
