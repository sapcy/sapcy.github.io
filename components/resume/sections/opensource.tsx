export function OpenSource() {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        오픈소스 기여
      </h2>
      <div className="bg-white p-5 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bitnami containers</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Bitnami의 argocd 도커 이미지 내 git 버전 차이로 인한 이슈 제기 후 해결
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>
              원인: bitnami/argo-cd:2.6.7-debian-11-r8 컨테이너 베이스 이미지에 설치된 git은 2.30.2 버전이었으나, 
              ArgoCD repository 설정에서 &quot;Force basic auth&quot; 옵션은 git 2.31.0 버전부터 제공하는 
              &apos;--config-env&apos; 옵션을 사용하므로 에러 발생
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            결과: ArgoCD의 &quot;Force basic auth&quot; 옵션 없이 기능 구현하여 문제는 해결됨
          </li>
        </ul>
        <a
          href="https://github.com/bitnami/containers/issues/34541"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-sm text-blue-600 hover:underline"
        >
          https://github.com/bitnami/containers/issues/34541 →
        </a>
      </div>
    </section>
  )
}

