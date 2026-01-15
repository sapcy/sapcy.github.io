'use client'

import { useState, useCallback } from 'react'
import { ProjectHeader } from './project-header'

interface KubeCertRequest {
  clusterName: string
  apiServerAddress: string
  additionalSANs: string
  serviceCIDR: string
  etcdServers: string
  certDays: number
  caDays: number
  includeEtcd: boolean
}

interface CertFile {
  path: string
  content: string
  type: string
}

interface KubeCertResult {
  files: CertFile[]
  zipBlob: Blob
}

const defaultRequest: KubeCertRequest = {
  clusterName: 'kubernetes',
  apiServerAddress: '',
  additionalSANs: '',
  serviceCIDR: '10.96.0.0/12',
  etcdServers: '',
  certDays: 3650,
  caDays: 36500,
  includeEtcd: true,
}

export function KubeCertProject() {
  const [request, setRequest] = useState<KubeCertRequest>(defaultRequest)
  const [result, setResult] = useState<KubeCertResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null) // Output 초기화
    setLoading(true)

    // 약간의 딜레이로 초기화 상태를 보여줌
    await new Promise(resolve => setTimeout(resolve, 100))

    try {
      const { generateKubeCerts } = await import('@sapcy/web-kube-cert/api')
      const certResult = await generateKubeCerts({
        ...request,
        includeKubeconfig: false,
      })
      setResult(certResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }, [request])

  const handleDownload = useCallback(() => {
    if (result?.zipBlob) {
      const url = URL.createObjectURL(result.zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'kubernetes-ssl.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }, [result])

  const updateField = <K extends keyof KubeCertRequest>(field: K, value: KubeCertRequest[K]) => {
    setRequest({ ...request, [field]: value })
  }

  return (
    <div>
      <ProjectHeader
        title="Kube Cert - Kubernetes PKI Generator"
        description="kubeadm 기반 Kubernetes 클러스터를 위한 PKI 인증서를 브라우저에서 생성합니다. 생성된 인증서를 /etc/kubernetes/pki에 배치 후 kubeadm init --skip-phases=certs로 클러스터를 초기화할 수 있습니다."
        githubUrl="https://github.com/sapcy/web-kube-cert"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Configuration</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* API Server Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Server Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={request.apiServerAddress}
                onChange={(e) => updateField('apiServerAddress', e.target.value)}
                className="w-full px-3 py-2 rounded material-input text-sm"
                placeholder="192.168.1.100"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Master node IP or domain</p>
            </div>

            {/* Cluster Name & Service CIDR */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cluster Name
                </label>
                <input
                  type="text"
                  value={request.clusterName}
                  onChange={(e) => updateField('clusterName', e.target.value)}
                  className="w-full px-3 py-2 rounded material-input text-sm"
                  placeholder="kubernetes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service CIDR
                </label>
                <input
                  type="text"
                  value={request.serviceCIDR}
                  onChange={(e) => updateField('serviceCIDR', e.target.value)}
                  className="w-full px-3 py-2 rounded material-input text-sm"
                  placeholder="10.96.0.0/12"
                />
              </div>
            </div>

            {/* Additional SANs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional SANs
              </label>
              <input
                type="text"
                value={request.additionalSANs}
                onChange={(e) => updateField('additionalSANs', e.target.value)}
                className="w-full px-3 py-2 rounded material-input text-sm"
                placeholder="k8s.example.com, 10.0.0.100"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated domains or IPs</p>
            </div>

            {/* Certificate Validity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CA Validity (days)
                </label>
                <input
                  type="number"
                  value={request.caDays}
                  onChange={(e) => updateField('caDays', parseInt(e.target.value) || 36500)}
                  className="w-full px-3 py-2 rounded material-input text-sm"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cert Validity (days)
                </label>
                <input
                  type="number"
                  value={request.certDays}
                  onChange={(e) => updateField('certDays', parseInt(e.target.value) || 3650)}
                  className="w-full px-3 py-2 rounded material-input text-sm"
                  min="1"
                />
              </div>
            </div>

            {/* etcd Options */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={request.includeEtcd}
                  onChange={(e) => updateField('includeEtcd', e.target.checked)}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
                />
                <span className="text-sm text-gray-700">Include etcd certificates</span>
              </label>
              
              {request.includeEtcd && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    etcd Servers
                  </label>
                  <input
                    type="text"
                    value={request.etcdServers}
                    onChange={(e) => updateField('etcdServers', e.target.value)}
                    className="w-full px-3 py-2 rounded material-input text-sm"
                    placeholder="Leave empty to use API Server address"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !request.apiServerAddress.trim()}
              className="w-full py-3 rounded material-btn text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="bg-white rounded border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Output</h2>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm mb-4">
              {error}
            </div>
          )}

          {!result && !error && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm mb-4">Enter cluster information and generate certificates.</p>
              <div className="text-left bg-gray-50 rounded p-4 text-xs font-mono">
                <p className="text-gray-600 mb-2">Generated files:</p>
                <pre className="text-gray-500">{`ssl/
├── ca.crt, ca.key
├── apiserver.crt, apiserver.key
├── apiserver-kubelet-client.crt, .key
├── front-proxy-ca.crt, .key
├── front-proxy-client.crt, .key
├── sa.pub, sa.key
└── etcd/
    ├── ca.crt, ca.key
    ├── server.crt, server.key
    ├── peer.crt, peer.key
    └── healthcheck-client.crt, .key`}</pre>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* File List */}
              <div className="bg-gray-50 rounded p-4 max-h-64 overflow-y-auto">
                <div className="text-xs font-mono space-y-1">
                  {result.files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      <span className="text-gray-400">
                        {file.type === 'certificate' ? 'crt' : 'key'}
                      </span>
                      <span>{file.path}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="w-full py-3 rounded material-btn text-sm"
              >
                Download
              </button>

              {/* Usage Instructions */}
              <div className="bg-gray-50 rounded p-4 text-xs">
                <p className="text-gray-600 font-medium mb-2">Usage:</p>
                <pre className="text-gray-500 overflow-x-auto">{`# Extract and copy to server
unzip kubernetes-ssl.zip
sudo cp -r kubernetes/ssl /etc/kubernetes/pki

# Initialize cluster (skip cert generation)
sudo kubeadm init --skip-phases=certs`}</pre>
              </div>

              {/* Security Notice */}
              <p className="text-xs text-gray-500">
                Keep private keys (.key) secure. Never commit to public repositories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
