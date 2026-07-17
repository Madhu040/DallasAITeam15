/**
 * Draws a grid level's cell vector to a canvas background layer — one canvas
 * pixel per cell, scaled up by CSS (`.grid-bg`, image-rendering: pixelated).
 */

import type { GridLevel } from "../content/gridLevels.js";

export function renderGridBackground(
  viewport: HTMLElement,
  level: GridLevel,
  debug = false,
): void {
  let canvas = viewport.querySelector<HTMLCanvasElement>("canvas.grid-bg");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.className = "grid-bg";
    viewport.appendChild(canvas);
  }

  canvas.width = level.map.cols;
  canvas.height = level.map.rows;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  for (const cell of level.map.cells) {
    ctx.fillStyle = cell.color;
    ctx.fillRect(cell.col, cell.row, 1, 1);
    if (debug && !cell.walkable) {
      ctx.fillStyle = "rgba(255, 40, 40, 0.4)";
      ctx.fillRect(cell.col, cell.row, 1, 1);
    }
  }
}
