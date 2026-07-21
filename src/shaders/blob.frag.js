export const blobFrag = /* glsl */`
precision highp float;

uniform float u_time;
uniform float u_fill;       // 0.0–1.0
uniform vec3  u_colorA;     // liquid bottom
uniform vec3  u_colorB;     // liquid top / surface
uniform vec3  u_darkColor;  // glass body
uniform vec3  u_rimColor;   // glass rim glow

varying vec3  v_pos;
varying vec3  v_normal;
varying float v_fill_factor;

void main(){
  // Animated liquid surface wave
  float wave =  sin(v_pos.x*8.0+u_time*3.5)*0.022
               +cos(v_pos.z*6.0+u_time*2.8)*0.018;

  float threshold=clamp(u_fill+wave, 0.001, 0.999);

  // Fresnel glass reflection factor
  vec3 viewDir=vec3(0.,0.,1.);
  float rim=1.-abs(dot(normalize(v_normal),viewDir));
  float fresnel=pow(rim, 2.2);

  if(v_fill_factor < threshold){
    // ══ LIQUID FILL ══════════════════════════════════════════════════
    float t=clamp(v_fill_factor/threshold, 0., 1.);
    vec3 color=mix(u_colorA, u_colorB, t*0.8 + 0.15);

    // Bright liquid surface crest
    float distToSurface = threshold - v_fill_factor;
    float surfaceShimmer = 1. - smoothstep(0., 0.04, distToSurface);
    color += surfaceShimmer * u_colorB * 0.45;

    // Glass rim highlight on liquid
    color += fresnel * u_rimColor * 0.4;

    gl_FragColor=vec4(color, 0.96);

  } else {
    // ══ EMPTY GLASS CONTAINER ════════════════════════════════════════
    vec3 color=u_darkColor + fresnel * u_rimColor * 0.55;

    // Soft liquid edge glow right at the surface line
    float edgeDist = v_fill_factor - threshold;
    float edgeGlow = 1. - smoothstep(0., 0.05, edgeDist);
    color += edgeGlow * u_colorB * 0.35;

    gl_FragColor=vec4(color, 0.88);
  }
}
`;
