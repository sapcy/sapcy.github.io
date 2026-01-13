'use client'

import { useState, useCallback } from 'react'
import { sealSecrets } from '@sapcy/web-sealedsecret/api'
import { WebSealForm, WebSealOutput } from '@sapcy/web-sealedsecret/components'
import type { SealResponse, KeyValuePair } from '@sapcy/web-sealedsecret'
import { ProjectHeader } from './project-header'

export function WebSealProject() {
  const [publicKey, setPublicKey] = useState('')
  const [keyValues, setKeyValues] = useState<KeyValuePair[]>([
    { id: crypto.randomUUID(), key: '', value: '' }
  ])
  const [namespace, setNamespace] = useState('default')
  const [secretName, setSecretName] = useState('my-secret')
  const [result, setResult] = useState<SealResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const addKeyValue = useCallback(() => {
    setKeyValues(prev => [...prev, { id: crypto.randomUUID(), key: '', value: '' }])
  }, [])

  const removeKeyValue = useCallback((id: string) => {
    setKeyValues(prev => prev.length > 1 ? prev.filter(kv => kv.id !== id) : prev)
  }, [])

  const updateKeyValue = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setKeyValues(prev => prev.map(kv => kv.id === id ? { ...kv, [field]: value } : kv))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)

    const data: Record<string, string> = {}
    keyValues.forEach(kv => {
      if (kv.key.trim()) {
        data[kv.key.trim()] = kv.value
      }
    })

    if (Object.keys(data).length === 0) {
      setError('최소 하나의 key-value 쌍이 필요합니다')
      setLoading(false)
      return
    }

    try {
      // 클라이언트에서 직접 sealSecrets 호출 (API Route 없이)
      const sealResult = await sealSecrets({
        publicKey,
        data,
        namespace,
        name: secretName,
        scope: 'strict',
      })
      setResult(sealResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }, [publicKey, keyValues, namespace, secretName])

  const copyToClipboard = useCallback(async () => {
    if (result?.resourceYAML) {
      await navigator.clipboard.writeText(result.resourceYAML)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [result])

  return (
    <div>
      <ProjectHeader
        title="WebSeal - Kubernetes Sealed Secrets Generator"
        description="Kubernetes Sealed Secrets를 브라우저에서 쉽게 생성할 수 있는 도구입니다. 공개키(PEM)와 시크릿 데이터를 입력하면 암호화된 SealedSecret YAML을 생성합니다."
        githubUrl="https://github.com/sapcy/web-sealedsecret"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <WebSealForm
          publicKey={publicKey}
          keyValues={keyValues}
          namespace={namespace}
          secretName={secretName}
          loading={loading}
          onPublicKeyChange={setPublicKey}
          onNamespaceChange={setNamespace}
          onSecretNameChange={setSecretName}
          onAddKeyValue={addKeyValue}
          onRemoveKeyValue={removeKeyValue}
          onUpdateKeyValue={updateKeyValue}
          onSubmit={handleSubmit}
        />
        <WebSealOutput
          result={result}
          error={error}
          copied={copied}
          onCopy={copyToClipboard}
        />
      </div>
    </div>
  )
}
