import { canvaskit, Layer } from "@canvaskit-tilemap/core";
import { CustomLayer } from "@canvaskit-tilemap/react";
import { Canvas } from "canvaskit-wasm";
import { zIndex } from ".";

/**
 * 黑色半透明遮罩层
 */
class _MaskLayer extends Layer {
  _paint = new canvaskit.Paint();

  constructor() {
    super({ zIndex: zIndex.underground });
    this._paint.setColor(canvaskit.Color(0, 0, 0, 0.7));
  }

  draw(canvas: Canvas) {
    canvas.drawRect(this.tilemap.visibleRect, this._paint);
  }
}

export function MaskLayer() {
  return <CustomLayer createLayer={() => new _MaskLayer()} />;
}
