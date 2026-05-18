/**
 * 로컬 개발(npm start) 시 StaticIac API를 프록시합니다.
 * secure: false 로 자체 서명 인증서를 검증하지 않습니다 (curl -k 와 동일).
 *
 * STATIC_IAC_API_PROXY_TARGET=https://52.79.133.73:8443
 */
const PROXY_PATH = '/static-iac-proxy';

module.exports = function staticIacDevProxyPlugin(context, options) {
  return {
    name: 'static-iac-dev-proxy',
    configureDevServer(devServer) {
      const target =
        options?.proxyTarget ||
        process.env.STATIC_IAC_API_PROXY_TARGET ||
        'https://127.0.0.1:8443';
      const existing = devServer.proxy;
      const entry = {
        target,
        secure: false,
        changeOrigin: true,
        pathRewrite: {[PROXY_PATH]: ''},
      };
      if (Array.isArray(existing)) {
        devServer.proxy = [{context: [PROXY_PATH], ...entry}, ...existing];
      } else {
        devServer.proxy = {[PROXY_PATH]: entry, ...existing};
      }
    },
  };
};

module.exports.PROXY_PATH = PROXY_PATH;
