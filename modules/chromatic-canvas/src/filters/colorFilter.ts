import { AnimationNumber } from "../animation/animationAttribute";
import { AnimationMeta } from "../animation/animationMeta";
import { AnimationType } from "../animation/animationType";
import { FadingFilter } from "../filterTypes/fadingFilter";
import { redFrag } from "../shaders/frag/redFrag";

export class ColorFilter extends FadingFilter {
  constructor() {
    super({
      meta: new AnimationMeta({
        name: 'color',
        type: AnimationType.CANVAS_FILTER,
        duration: 3000,
      }),
      attributes: {
        intensity: new AnimationNumber({
          path: 'intensity',
          from: 0.0,
          to: 1.0,
        })
      },
      frag: redFrag,
    })
  }
}

// export class ColorFilter extends FadingFilter {
//   public color: number;
//   public intensity: number;

//   constructor(options: ColorFilterOptions) {
//     const fragmentSrc = `
//       varying vec2 vTextureCoord;
//       uniform sampler2D uSampler;
//       uniform vec3 uColor;
//       uniform float intensity;

//       void main(void){
//         vec4 base = texture2D(uSampler, vTextureCoord);
//         vec3 overlay = mix(base.rgb, uColor, intensity);
//         gl_FragColor = vec4(overlay, base.a);
//       }
//     `;

//     super(undefined, fragmentSrc);

//     this.color = options.color;
//     this.intensity = options.intensity ?? 0.5;
//     this.fadingDuration = options.duration ?? 0;

//     const r = ((this.color >> 16) & 0xff) / 255;
//     const g = ((this.color >> 8) & 0xff) / 255;
//     const b = (this.color & 0xff) / 255;
//     this.uniforms['uColor'] = [r, g, b];
//     this.uniforms['intensity'] = this.intensity;
//   }

//   public override activate(): void {
//     this.fadeIn();
//   }

//   public override deactivate(): void {
//     this.fadeOut();
//   }

//   protected override updateFade(progress: number): void {
//     this.uniforms['intensity'] = progress;
//   }

//   public override step(delta: number): void {
//     super.step(delta);
//   }
// }
