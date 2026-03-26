/**
 * @sapcy/* 는 `scripts/build-sapcy-packages.mjs`로 dist를 만든 뒤 일반 JS로 번들됨.
 * @socialgouv/aes-gcm-rsa-oaep 등이 `require('crypto')` 를 쓰므로 브라우저 번들에 폴리필 필요.
 *
 * dev 서버에서 resolve.fallback 만으로는 crypto 가 안 잡히는 경우가 있어
 * NormalModuleReplacementPlugin(beforeResolve) 으로 request `crypto` 를 직접 치환한다.
 */
const webpack = require('webpack');

const processBrowser = require.resolve('process/browser.js');

function clientPolyfillPaths() {
  return {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    process: processBrowser,
  };
}

/**
 * 클라이언트 번들 configureWebpack 에만 등록됨
 */
class BrowserNodePolyfillsPlugin {
  apply(compiler) {
    compiler.hooks.afterEnvironment.tap('BrowserNodePolyfillsPlugin', () => {
      const resolve =
        compiler.options.resolve || (compiler.options.resolve = {});
      const p = clientPolyfillPaths();
      const fallback = resolve.fallback || (resolve.fallback = {});
      Object.assign(fallback, p);

      const alias = resolve.alias || (resolve.alias = {});
      if (typeof alias === 'object' && !Array.isArray(alias)) {
        alias['process/browser'] = processBrowser;
        alias.crypto = p.crypto;
        alias['node:crypto'] = p.crypto;
        alias.stream = p.stream;
        alias.buffer = p.buffer;
      }
    });
  }
}

module.exports = function transpileSapcyPackages() {
  const p = clientPolyfillPaths();

  return {
    name: 'transpile-sapcy-packages',
    configureWebpack(config, isServer) {
      if (isServer) {
        return {
          resolve: {
            alias: {
              'process/browser': processBrowser,
            },
          },
        };
      }

      const existingFallback =
        config.resolve && config.resolve.fallback
          ? {...config.resolve.fallback}
          : {};

      const existingAlias =
        config.resolve && config.resolve.alias
          ? typeof config.resolve.alias === 'object' &&
            !Array.isArray(config.resolve.alias)
            ? {...config.resolve.alias}
            : {}
          : {};

      const clientFallback = {
        ...existingFallback,
        ...p,
      };

      const clientAlias = {
        ...existingAlias,
        'process/browser': processBrowser,
        crypto: p.crypto,
        'node:crypto': p.crypto,
        stream: p.stream,
        buffer: p.buffer,
      };

      return {
        resolve: {
          alias: clientAlias,
          fallback: clientFallback,
        },
        plugins: [
          // beforeResolve: request === 'crypto' | 'node:crypto' → 절대 경로로 치환 (dev에서도 동작)
          new webpack.NormalModuleReplacementPlugin(/^crypto$/, p.crypto),
          new webpack.NormalModuleReplacementPlugin(/^node:crypto$/, p.crypto),
          new BrowserNodePolyfillsPlugin(),
          new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: processBrowser,
          }),
        ],
      };
    },
  };
};
