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
  const cornerR = width * 0.24;

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

      // Base: #0F1014 Soft Matte
      let red = 15, green = 16, blue = 20, alpha = 255;

      // Glow border
      if (borderDist < 2.5) {
        red = 59; green = 130; blue = 246; // Electric Blue #3B82F6
      } else if (borderDist < 4.5) {
        red = 30; green = 45; blue = 70;
      }

      // Keyboard plate
      const kbX1 = cx - width * 0.36;
      const kbX2 = cx + width * 0.36;
      const kbY1 = cy - height * 0.22;
      const kbY2 = cy + height * 0.30;

      // Wireless Bluetooth dot on top
      const waveY = cy - height * 0.30;
      if (Math.hypot(x - cx, y - waveY) < width * 0.05) {
        red = 56; green = 189; blue = 248;
      }

      if (x >= kbX1 && x <= kbX2 && y >= kbY1 && y <= kbY2) {
        red = 26; green = 28; blue = 35; // Plate #1A1C23
        const rowH = (kbY2 - kbY1) / 3;
        const pad = Math.max(1, width * 0.02);
        const rowIdx = Math.floor((y - kbY1) / rowH);
        const inRow = (y - (kbY1 + rowIdx * rowH)) > pad && (y - (kbY1 + (rowIdx + 1) * rowH)) < -pad;

        if (inRow) {
          if (rowIdx < 2) {
            const colW = (kbX2 - kbX1) / 4;
            const colIdx = Math.floor((x - kbX1) / colW);
            const inCol = (x - (kbX1 + colIdx * colW)) > pad && (x - (kbX1 + (colIdx + 1) * colW)) < -pad;
            if (inCol) {
              if ((rowIdx + colIdx) % 2 === 0) {
                red = 59; green = 130; blue = 246; // Electric blue key
              } else {
                red = 39; green = 42; blue = 53; // Soft matte key
              }
            }
          } else {
            // Spacebar
            const spX1 = kbX1 + width * 0.12;
            const spX2 = kbX2 - width * 0.12;
            if (x >= spX1 && x <= spX2) {
              red = 56; green = 189; blue = 248; // Cyan spacebar
            } else if (x > kbX1 + pad && x < spX1 - pad) {
              red = 59; green = 130; blue = 246;
            } else if (x > spX2 + pad && x < kbX2 - pad) {
              red = 59; green = 130; blue = 246;
            }
          }
        }
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
