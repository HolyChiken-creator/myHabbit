import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const required = [
  'src/worker.js',
  'public/index.html',
  'public/app.js',
  'public/styles.css',
  'public/sw.js',
  'public/manifest.webmanifest',
  'public/assets',
  'public/assets/stickers',
  'public/content',
  'wrangler.jsonc',
  'package.json',
  'VERSION',
  'public/VERSION.txt'
];

const errors = [];

for (const relative of required) {
  try {
    await access(path.join(root, relative));
  } catch {
    errors.push(`Missing required path: ${relative}`);
  }
}

const forbiddenRootFiles = ['index.html', 'app.js', 'styles.css', 'sw.js', 'manifest.webmanifest'];
for (const file of forbiddenRootFiles) {
  try {
    await access(path.join(root, file));
    errors.push(`Forbidden duplicate in repository root: ${file}`);
  } catch {
    // Expected: active PWA files belong only in public/.
  }
}

const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const version = (await readFile(path.join(root, 'VERSION'), 'utf8')).trim();
const publicVersion = (await readFile(path.join(root, 'public/VERSION.txt'), 'utf8')).trim();
if (packageJson.version !== version || version !== publicVersion) {
  errors.push(`Version mismatch: package=${packageJson.version}, VERSION=${version}, public=${publicVersion}`);
}

async function findSystemFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await findSystemFiles(full);
    if (entry.isFile() && ['desktop.ini', 'Thumbs.db', '.DS_Store'].includes(entry.name)) {
      errors.push(`System file must not be committed: ${path.relative(root, full)}`);
    }
  }
}
await findSystemFiles(root);

if (errors.length) {
  console.error('Project validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Project structure is valid. Version ${version}.`);
