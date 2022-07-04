precision highp float;

uniform sampler2D tMap;

varying vec2 vUv;
varying vec3 vNormal;

void main(){
    vec3 normal=normalize(vNormal);
    vec3 tex=texture2D(tMap,vUv).rgb;
    
    vec3 light=normalize(vec3(.5,1.,-.3));
    float shading=dot(normal,light)*.15;
    
    gl_FragColor.rgb=tex+shading;
    gl_FragColor.a=1.;
}