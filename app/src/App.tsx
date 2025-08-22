import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function App(){
  const [name, setName] = useState('John Doe')
  const [policy, setPolicy] = useState('123456789')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [filename, setFilename] = useState('insurance-card.pdf')

  useEffect(() => {
    // cleanup object URL on unmount
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [pdfUrl])

  async function generate(){
    setLoading(true)
    try{
      const res = await axios.post('http://localhost:3000/pdf/insurance-card', { name, policyNumber: policy, provider: 'Acme', validUntil: '2026-12-31' }, { responseType: 'blob' })
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      // revoke previous if present
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
      setPdfUrl(url)
      setFilename(`insurance-card-${policy || 'card'}.pdf`)
    }catch(err){
      console.error('Failed to generate PDF', err)
      alert('Failed to generate PDF. See console for details.')
    }finally{
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
        <img src="/pdf_gen.png" alt="logo" className="logo"/>
        <h1>PDFGen</h1>
      </header>
      <main>
        <div className="form">
          <label>Name<input value={name} onChange={e=>setName(e.target.value)}/></label>
          <label>Policy<input value={policy} onChange={e=>setPolicy(e.target.value)}/></label>
          <div style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
            <button onClick={generate} disabled={loading}>{loading ? 'Generating…' : 'Generate PDF'}</button>
            <button onClick={download} disabled={!pdfUrl}>Download</button>
            <button onClick={openInNewTab} disabled={!pdfUrl}>Open in new tab</button>
            <button onClick={clearPreview} disabled={!pdfUrl}>Clear preview</button>
          </div>
        </div>

        <section className="preview">
          {pdfUrl ? (
            <iframe title="PDF Preview" src={pdfUrl} frameBorder={0} className="pdf-frame" />
          ) : (
            <div className="placeholder">No preview — generate a PDF to preview it here.</div>
          )}
        </section>
      </main>
    </div>
  )
}
