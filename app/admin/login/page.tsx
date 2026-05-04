'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { setError('Ingresa email y contraseña'); return }
    setLoading(true)
    setError('')
    setStatus('Conectando...')
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      setStatus('Autenticando...')
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) { setError('Error: ' + authError.message); setStatus(''); setLoading(false); return }
      if (!data.session) { setError('Sin sesión. Reintenta.'); setStatus(''); setLoading(false); return }
      setStatus('Redirigiendo...')
      window.location.href = '/admin/dashboard'
    } catch (e: any) {
      setError('Excepción: ' + (e?.message ?? String(e)))
      setStatus('')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', letterSpacing: '4px' }}>VEINTIOX</div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>PANEL ADMIN</div>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>INICIAR SESIÓN</div>
          <div>
            <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@veintiox.store"
              autoComplete="email"
              style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
              style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          {error && <div style={{ color: '#f87171', fontSize: '13px', wordBreak: 'break-all' }}>{error}</div>}
          {status && !error && <div style={{ color: '#22d3ee', fontSize: '13px' }}>{status}</div>}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            style={{ background: loading ? '#555' : '#22d3ee', color: '#000', border: 'none', borderRadius: '8px', padding: '14px', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px', cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}
          >
            {loading ? 'CARGANDO...' : 'ENTRAR'}
          </button>
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>
            ¿Primera vez? <a href="/admin/setup" style={{ color: '#22d3ee' }}>Crear cuenta admin</a>
          </div>
        </div>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
