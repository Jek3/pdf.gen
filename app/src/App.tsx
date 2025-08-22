import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function App(){
  const [name, setName] = useState('First Last')
  const [policy, setPolicy] = useState('123456789')
  const [provider, setProvider] = useState('UCC')
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().slice(0, 10)
  })

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [filename, setFilename] = useState('insurance-card.pdf')

  async function generate(){
    setLoading(true)
    try{
      const apiBase = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000'
      const res = await axios.post(`${apiBase}/pdf/insurance-card`, { name, policyNumber: policy, provider, validUntil }, { responseType: 'blob' })
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      // revoke previous if present
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
        setPdfUrl(url)
        setFilename(`insurance-card-${policy || 'card'}.pdf`)
      }
      catch(err){
        console.error('Failed to Generate', err)
        alert('Failed to Generate. See console for details.')
      }
      finally{
        setLoading(false)
      }
  }

  function download(){
    if (!pdfUrl) return
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  function openInNewTab(){
    if (!pdfUrl) return
    window.open(pdfUrl, '_blank')
  }

  function clearPreview(){
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <img src="/img/pdf_gen.png" alt="logo" className="logo"/>
        <h1>PDFGen - Insurance Card Demo</h1>
      </header>
      <main>
        <div className="form">
          <div className="form-grid">
            <div className="col">
              <label>Provider
                <select value={provider} onChange={e=>setProvider(e.target.value)}>
                  <option value="UCC">UCC</option>
                  <option value="UCB">UCB</option>
                  <option value="UCA">UCA</option>
                </select>
              </label>
              <label>Name<input value={name} onChange={e=>setName(e.target.value)}/></label>
            </div>
            <div className="col">
              <label>Policy #<input value={policy} onChange={e=>setPolicy(e.target.value)}/></label>
              <label>Valid Until
                <input type="date" value={validUntil} onChange={e=>setValidUntil(e.target.value)} />
              </label>
            </div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
            <button onClick={generate} disabled={loading}>
              {loading ? <><i className="fas fa-spinner fa-spin" /> Generating…</> : <><i className="fas fa-file-pdf" /> Generate</>}
            </button>
            <button onClick={download} disabled={!pdfUrl}>
              <i className="fas fa-download" /> Download
            </button>
            <button onClick={openInNewTab} disabled={!pdfUrl}>
              <i className="fas fa-external-link-alt" /> Open in new tab
            </button>
            <button onClick={clearPreview} disabled={!pdfUrl}>
              <i className="fas fa-trash" /> Clear preview
            </button>
          </div>
        </div>

        <section className="preview">
          {pdfUrl ? (
            <iframe title="Preview" src={pdfUrl} style={{border: 'none'}} className="pdf-frame" />
          ) : (
            <div className="placeholder">Generate a document to preview.</div>
          )}
        </section>
      </main>
    </div>
  )
}
