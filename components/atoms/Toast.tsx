'use client'

import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { clsx } from 'clsx'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = String(++counter.current)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const icons = {
    success: <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />,
    error: <XCircle className="w-4 h-4 flex-shrink-0 text-red-400" />,
    info: <AlertCircle className="w-4 h-4 flex-shrink-0 text-vx-cyan" />,
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed top-20 right-4 z-[200] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={clsx(
              'flex items-start gap-3 px-4 py-3 rounded-xl border text-sm shadow-lg',
              'bg-vx-gray900 border-vx-gray700 text-vx-white',
              'animate-[fade-up_0.25s_ease_forwards]'
            )}
          >
            {icons[t.type]}
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Cerrar"
              className="text-vx-gray500 hover:text-vx-white transition-colors mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
