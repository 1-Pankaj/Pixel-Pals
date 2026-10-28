/**
 * Draws a PixelBuffer onto a <canvas> with perfectly crisp, evenly sized pixels on any display.
 * The canvas is sized in real device pixels (an integer number per sprite pixel), so a 125% or
 * 150% Windows scale never produces uneven "wobbly" pixels.
 */
(function (root) {
  'use strict';
  function createView(canvas, bw, bh, scale) {
    const off = document.createElement('canvas');
    off.width = bw; off.height = bh;
    const octx = off.getContext('2d'), ctx = canvas.getContext('2d');
    let k = 1, dpr = 1, s = scale;
    return {
      setScale(v) { s = v; },
      /** Re-measure the display. Returns CSS pixels per sprite pixel. */
      fit() {
        dpr = window.devicePixelRatio || 1;
        k = Math.max(1, Math.round(s * dpr));
        canvas.width = bw * k; canvas.height = bh * k;
        canvas.style.width = (bw * k) / dpr + 'px';
        canvas.style.height = (bh * k) / dpr + 'px';
        ctx.imageSmoothingEnabled = false;
        return k / dpr;
      },
      draw(buf) {
        octx.putImageData(new ImageData(buf.data, bw, bh), 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
      },
      get dpr() { return dpr; },
    };
  }
  root.Display = { createView };
})(typeof self !== 'undefined' ? self : this);
