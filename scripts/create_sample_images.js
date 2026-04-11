const fs = require('fs');
const path = require('path');

const dir = 'assets/photos';
fs.mkdirSync(dir, { recursive: true });

// small colored PNG files generated from 1x1 transparent PNG base64 but tinted via simple PNGs
const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
for(let i=1;i<=6;i++){
  const file = path.join(dir, `sample${i}.png`);
  fs.writeFileSync(file, Buffer.from(b64, 'base64'));
  console.log('wrote', file);
}

console.log('Sample images created (tiny placeholders).');
