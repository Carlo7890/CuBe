// src/utils/textTexture.js
import * as THREE from 'three';

export function createTextTexture(text, {
  size = 256,
  bg = 'rgba(255,255,255,0)', // 투명 배경
  color = '#111',
  font = 'bold 52px Noto Sans KR',
  lineHeight = 54,
  padding = 0.1, // 사방 여백 비율
  align = 'center',
} = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 배경
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // 텍스트 설정
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';

  const maxWidth = size * (1 - padding * 2);
  const x = align === 'center' ? size / 2 : padding * size;

  // 간단 줄바꿈
  const words = String(text ?? '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  const measure = t => ctx.measureText(t).width;
  if (words.length === 0) {
    lines.push('');
  } else {
    for (const w of words) {
      const cand = line ? line + ' ' + w : w;
      if (measure(cand) > maxWidth) {
        if (line) lines.push(line);
        line = w;
      } else {
        line = cand;
      }
    }
    if (line) lines.push(line);
  }

  const totalH = lineHeight * Math.max(lines.length, 1);
  const startY = size / 2 - (totalH - lineHeight) / 2;

  lines.forEach((l, i) => {
    ctx.fillText(l, x, startY + i * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
