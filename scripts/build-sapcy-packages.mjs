/**
 * GitHub에서 설치한 @sapcy/* 패키지는 dist 없이 src만 올 수 있음.
 * Webpack이 node_modules 안의 TS를 안정적으로 못 돌리는 환경이 있어,
 * 설치/빌드 전에 tsc로 dist를 생성한다.
 */
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const PACKAGES = [
  {
    name: '@sapcy/web-kube-cert',
    /** npm 패키지에 tsconfig가 없을 때 사용 */
    fallbackTsConfig: path.join(__dirname, 'tsconfig.sapcy-web-kube-cert.json'),
  },
  {
    name: '@sapcy/web-sealedsecret',
    fallbackTsConfig: null,
  },
];

function distReady(pkgDir) {
  const main = path.join(pkgDir, 'dist', 'index.js');
  return fs.existsSync(main);
}

function ensureTsconfig(pkgDir, fallbackPath) {
  const existing = path.join(pkgDir, 'tsconfig.json');
  if (fs.existsSync(existing)) return existing;
  if (!fallbackPath || !fs.existsSync(fallbackPath)) {
    throw new Error(`No tsconfig for ${pkgDir} and no fallback`);
  }
  fs.copyFileSync(fallbackPath, existing);
  return existing;
}

for (const {name, fallbackTsConfig} of PACKAGES) {
  const pkgDir = path.join(root, 'node_modules', name);
  if (!fs.existsSync(pkgDir)) {
    console.warn(`[build-sapcy-packages] skip ${name} (not installed)`);
    continue;
  }
  if (distReady(pkgDir)) {
    console.log(`[build-sapcy-packages] ${name} dist already exists, skip`);
    continue;
  }

  console.log(`[build-sapcy-packages] tsc → dist for ${name}...`);
  ensureTsconfig(pkgDir, fallbackTsConfig);
  const tscBin = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');
  if (!fs.existsSync(tscBin)) {
    throw new Error(`typescript not found at ${tscBin}`);
  }
  execSync(`node "${tscBin}" -p "${path.join(pkgDir, 'tsconfig.json')}"`, {
    cwd: pkgDir,
    stdio: 'inherit',
    env: {...process.env},
  });
}
