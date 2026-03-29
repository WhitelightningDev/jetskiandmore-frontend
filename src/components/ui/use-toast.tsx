import * as React from "react"

type ToastVariant = "default" | "destructive" | "success"

export type ToastData = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant
  duration?: number
}

type ToastContextValue = {
  toasts: ToastData[]
  toast: (t: Omit<ToastData, "id"> & { id?: string }) => string
  dismiss: (id?: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

function randomId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function ToastProviderInternal({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([])

  const dismiss = React.useCallback((id?: string) => {
    setToasts((prev) => (id ? prev.filter((t) => t.id !== id) : []))
  }, [])

  const toast = React.useCallback(
    (t: Omit<ToastData, "id"> & { id?: string }) => {
      const id = t.id || randomId()
      const duration = typeof t.duration === "number" ? t.duration : 4500
      setToasts((prev) => [{ ...t, id }, ...prev].slice(0, 5))
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss]
  )

  const value = React.useMemo(() => ({ toasts, toast, dismiss }), [dismiss, toast, toasts])
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProviderInternal")
  return ctx
}

// Convenience export so pages can import `toast(...)` without a hook.
export function useToastActions() {
  const { toast, dismiss } = useToast()
  return { toast, dismiss }
}

let globalToast: ToastContextValue["toast"] | null = null
let globalDismiss: ToastContextValue["dismiss"] | null = null

export function ToastBridge() {
  const { toast, dismiss } = useToast()
  React.useEffect(() => {
    globalToast = toast
    globalDismiss = dismiss
    return () => {
      globalToast = null
      globalDismiss = null
    }
  }, [dismiss, toast])
  return null
}

export function toast(t: Omit<ToastData, "id">) {
  if (!globalToast) {
    // No provider mounted yet; fail silently
    return ""
  }
  return globalToast(t)
}

export function dismissToast(id?: string) {
  globalDismiss?.(id)
}
