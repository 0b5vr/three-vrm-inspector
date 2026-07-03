uniform float uRenderQueue;
uniform float uFillPattern;

#include <common>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

/*!
* Polynomial approximation of the Turbo Colormap
* (c) 2019 Google LLC., Apache License 2.0
*/
vec3 TurboColormap(in float x) {
  const vec4 kRedVec4 = vec4(0.13572138, 4.61539260, -42.66032258, 132.13108234);
  const vec4 kGreenVec4 = vec4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
  const vec4 kBlueVec4 = vec4(0.10667330, 12.64194608, -60.58204836, 110.36276771);
  const vec2 kRedVec2 = vec2(-152.94239396, 59.28637943);
  const vec2 kGreenVec2 = vec2(4.27729857, 2.82956604);
  const vec2 kBlueVec2 = vec2(-89.90310912, 27.34824973);
  
  x = clamp(x, 0.0, 1.0);
  vec4 v4 = vec4(1.0, x, x * x, x * x * x);
  vec2 v2 = v4.zw * v4.z;
  return vec3(
    dot(v4, kRedVec4)   + dot(v2, kRedVec2),
    dot(v4, kGreenVec4) + dot(v2, kGreenVec2),
    dot(v4, kBlueVec4)  + dot(v2, kBlueVec2)
  );
}

vec3 hslToRgb(vec3 hsl) {
  vec3 rgb = clamp(abs(mod(hsl.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0));
}

float getFillPattern() {
  if (uFillPattern == 0.0) {
    return 0.2;
  } else if (uFillPattern == 1.0) {
    vec2 c4 = mod(floor(gl_FragCoord.xy), 4.0);
    return float(c4.x == 0.0 && c4.y == 0.0) + float(c4.x == 2.0 && c4.y == 2.0);
  } else if (uFillPattern == 2.0) {
    float stripe = mod(gl_FragCoord.y, 4.0);
    return step(stripe, 1.0);
  } else {
    float stripe = mod(gl_FragCoord.x + gl_FragCoord.y, 4.0);
    return step(stripe, 1.0);
  }
}

void main() {
  #include <clipping_planes_fragment>

  vec3 color = TurboColormap(uRenderQueue / 19.0);
  color = mix(color, vec3(1.0), getFillPattern());

  #include <logdepthbuf_fragment>

  gl_FragColor = vec4(color, 1.0);
}
