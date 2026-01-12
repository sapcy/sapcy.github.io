'use client'

import { useWebSeal, WebSealForm, WebSealOutput } from '@sapcy/web-sealedsecret/components'
import { ProjectHeader } from './project-header'

export function WebSealProject() {
  const webseal = useWebSeal({ apiEndpoint: '/api/seal' })

  return (
    <div>
      <ProjectHeader
        title="WebSeal - Kubernetes Sealed Secrets Generator"
        description="Kubernetes Sealed Secrets를 브라우저에서 쉽게 생성할 수 있는 도구입니다. 공개키(PEM)와 시크릿 데이터를 입력하면 암호화된 SealedSecret YAML을 생성합니다."
        githubUrl="https://github.com/sapcy/web-sealedsecret"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <WebSealForm
          publicKey={webseal.publicKey}
          keyValues={webseal.keyValues}
          namespace={webseal.namespace}
          secretName={webseal.secretName}
          loading={webseal.loading}
          onPublicKeyChange={webseal.setPublicKey}
          onNamespaceChange={webseal.setNamespace}
          onSecretNameChange={webseal.setSecretName}
          onAddKeyValue={webseal.addKeyValue}
          onRemoveKeyValue={webseal.removeKeyValue}
          onUpdateKeyValue={webseal.updateKeyValue}
          onSubmit={webseal.handleSubmit}
        />
        <WebSealOutput
          result={webseal.result}
          error={webseal.error}
          copied={webseal.copied}
          onCopy={webseal.copyToClipboard}
        />
      </div>
    </div>
  )
}
