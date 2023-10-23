import { Layer } from "@canvaskit-map/core";
import { CustomLayer } from "@canvaskit-map/react";
import { Canvas, Paint } from "canvaskit-wasm";
import { zIndex } from ".";

class _ShadowLayer extends Layer {
  _paint?: Paint;

  constructor() {
    super({ zIndex: zIndex.underground });
  }

  async init() {
    this._paint = new this.canvaskit!.Paint();
    this._paint!.setShader(
      this.canvaskit!.Shader.MakeRadialGradient(
        [this.map!.size[0] / 2, this.map!.size[1] / 2],
        Math.max(...this.map!.size),
        [
          this.canvaskit!.TRANSPARENT,
          this.canvaskit!.TRANSPARENT,
          this.canvaskit!.BLACK,
        ],
        [0, 0.2, 1],
        this.canvaskit!.TileMode.Clamp
      )
    );
  }

  draw(canvas: Canvas) {
    canvas.save();
    canvas.concat(this.canvaskit!.Matrix.invert(canvas.getTotalMatrix())!);
    canvas.scale(devicePixelRatio, devicePixelRatio);
    canvas.drawPaint(this._paint!);
    canvas.restore();
  }
}

export function ShadowLayer() {
  return <CustomLayer createLayer={() => new _ShadowLayer()} />;
}
