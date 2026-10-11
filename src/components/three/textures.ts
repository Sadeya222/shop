import * as THREE from "three";

/** Tiny helper: draw to an offscreen canvas and wrap it as a CanvasTexture. */
const make = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, srgb = true) => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
};

/** Monocrystalline PV cells: deep teal-blue wafers, bright cell edges, bus-bars. */
export const createPanelTexture = () =>
  make(384, 320, (ctx, w, h) => {
    const base = ctx.createLinearGradient(0, 0, w, h);
    base.addColorStop(0, "#0a3d52");
    base.addColorStop(0.5, "#14627f");
    base.addColorStop(1, "#0c4560");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    const cols = 8;
    const rows = 6;
    const cw = w / cols;
    const ch = h / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cw;
        const y = r * ch;
        // each wafer is a touch different — real-cell variation
        ctx.fillStyle = `rgba(255,255,255,${0.015 + ((r * 7 + c * 3) % 5) * 0.012})`;
        ctx.fillRect(x + 2, y + 2, cw - 4, ch - 4);
        // cell edge
        ctx.strokeStyle = "rgba(190,236,250,0.42)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1.5, y + 1.5, cw - 3, ch - 3);
        // bus-bars
        ctx.strokeStyle = "rgba(235,250,255,0.26)";
        ctx.lineWidth = 1;
        for (const k of [1 / 3, 2 / 3]) {
          ctx.beginPath();
          ctx.moveTo(x + cw * k, y + 3);
          ctx.lineTo(x + cw * k, y + ch - 3);
          ctx.stroke();
        }
      }
    }
  });

/** A single soft diagonal band of light that sweeps across the glass. */
export const createSheenTexture = () => {
  const tex = make(
    256,
    32,
    (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.55, "rgba(255,255,255,0)");
      g.addColorStop(0.78, "rgba(255,255,255,0.95)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    },
    false
  );
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.center.set(0.5, 0.5);
  tex.rotation = 0.65;
  return tex;
};

/** Warm solar halo (alpha fades smoothly to zero so it never shows a hard edge). */
export const createGlowTexture = () =>
  make(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(255,226,120,1)");
    g.addColorStop(0.18, "rgba(255,206,60,0.7)");
    g.addColorStop(0.45, "rgba(255,192,10,0.22)");
    g.addColorStop(0.75, "rgba(255,192,10,0.05)");
    g.addColorStop(1, "rgba(255,192,10,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });

/** Soft forest-tinted contact shadow that sells the floating island. */
export const createShadowTexture = () =>
  make(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(15,53,42,0.55)");
    g.addColorStop(0.5, "rgba(15,53,42,0.2)");
    g.addColorStop(1, "rgba(15,53,42,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
