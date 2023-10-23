import { Layer } from "@canvaskit-map/core";
import { CustomLayer } from "@canvaskit-map/react";
import { Canvas, Paint } from "canvaskit-wasm";
import { zIndex } from ".";

/**
 * 黑色半透明遮罩层
 */
class _MaskLayer extends Layer {
  _paint?: Paint;

  constructor() {
    super({ zIndex: zIndex.underground });
  }

  async init() {
    this._paint = new this.canvaskit!.Paint();
    this._paint.setColor(this.canvaskit!.Color(0, 0, 0, 0.7));
  }

  draw(canvas: Canvas) {
    canvas.drawRect(this.map!.rect, this._paint!);
  }
}

export function MaskLayer() {
  return <CustomLayer createLayer={() => new _MaskLayer()} />;
}
