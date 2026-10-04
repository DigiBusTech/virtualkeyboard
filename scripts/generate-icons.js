const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table & helper
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const buf = Buffer.alloc(12 + data.length);
  buf.writeUInt32BE(data.length, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  buf.writeUInt32BE(crc32(buf.subarray(4, 8 + data.length)), 8 + data.length);
  return buf;
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function createPng(width, height, isRound) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA

  const rawData = Buffer.alloc((1 + width * 4) * height);
  const cx = width / 2;
  const cy = height / 2;
  const r = (width / 2) * 0.94;
  const cornerR = width * 0.22;
  const strokeR = Math.max(2, width * 0.055);

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter 0
    for (let x = 0; x < width; x++) {
      let inside = false;
      let borderDist = 0;
      if (isRound) {
        const d = Math.hypot(x - cx, y - cy);
        inside = d <= r;
        borderDist = r - d;
      } else {
        const dx = Math.max(Math.abs(x - cx) - (cx - cornerR), 0);
        const dy = Math.max(Math.abs(y - cy) - (cy - cornerR), 0);
        const d = Math.hypot(dx, dy);
        inside = d <= cornerR;
        borderDist = cornerR - d;
      }

      if (!inside) {
        rawData.fill(0, offset, offset + 4);
        offset += 4;
        continue;
      }

      // Base: #0F1014 Soft Matte Dark
      let red = 15, green = 16, blue = 20, alpha = 255;

      // Subtle Outer Edge Glow
      if (borderDist < 2.5) {
        red = 37; green = 99; blue = 235; // Brand Blue #2563EB
      } else if (borderDist < 5.0) {
        red = 25; green = 40; blue = 65;
      }

      // Inner plate subtle elevated fill
      const innerD = isRound ? Math.hypot(x - cx, y - cy) : Math.hypot(Math.max(Math.abs(x - cx) - (cx - cornerR * 1.3), 0), Math.max(Math.abs(y - cy) - (cy - cornerR * 1.3), 0));
      if (innerD < r * 0.85) {
        red = 20; green = 23; blue = 32;
      }

      // DigiBusTech `< / >` Symbol Coordinates
      // Left bracket `<`
      const dL1 = distToSegment(x, y, cx - width * 0.17, cy - height * 0.24, cx - width * 0.35, cy);
      const dL2 = distToSegment(x, y, cx - width * 0.35, cy, cx - width * 0.17, cy + height * 0.24);
      const dLeft = Math.min(dL1, dL2);

      // Center slash `/`
      const dSlash = distToSegment(x, y, cx + width * 0.08, cy - height * 0.28, cx - width * 0.08, cy + height * 0.28);

      // Right bracket `>`
      const dR1 = distToSegment(x, y, cx + width * 0.17, cy - height * 0.24, cx + width * 0.35, cy);
      const dR2 = distToSegment(x, y, cx + width * 0.35, cy, cx + width * 0.17, cy + height * 0.24);
      const dRight = Math.min(dR1, dR2);

      const symbolDist = Math.min(dLeft, dSlash, dRight);

      if (symbolDist <= strokeR) {
        // Core symbol: Electric Blue (#2563EB -> #38BDF8 gradient)
        const grad = (y / height);
        red = Math.round(37 + grad * 20);
        green = Math.round(99 + grad * 70);
        blue = Math.round(235 + grad * 15);
      } else if (symbolDist <= strokeR + 3.0) {
        // Glow aura
        const factor = 1 - (symbolDist - strokeR) / 3.0;
        red = Math.round(red * (1 - factor) + 56 * factor);
        green = Math.round(green * (1 - factor) + 189 * factor);
        blue = Math.round(blue * (1 - factor) + 248 * factor);
      }

      rawData[offset++] = red;
      rawData[offset++] = green;
      rawData[offset++] = blue;
      rawData[offset++] = alpha;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

const densities = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

const resDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

densities.forEach(({ dir, size }) => {
  const targetDir = path.join(resDir, dir);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), createPng(size, size, false));
  fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), createPng(size, size, true));
  console.log(`Generated ${dir} (${size}x${size})`);
});
console.log('App icons generated successfully!');
