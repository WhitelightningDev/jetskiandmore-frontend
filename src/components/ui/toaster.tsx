import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { ToastBridge, ToastProviderInternal, useToast } from "@/components/ui/use-toast"

function ToastList() {
  const { toasts, dismiss } = useToast()
  return (
    <>
      {toasts.map((t) => (
        <Toast key={t.id} variant={t.variant} onOpenChange={(open) => (!open ? dismiss(t.id) : undefined)}>
          <div className="grid gap-1">
            {t.title ? <ToastTitle>{t.title}</ToastTitle> : null}
            {t.description ? <ToastDescription>{t.description}</ToastDescription> : null}
          </div>
          <ToastClose />
        </Toast>
      ))}
    </>
  )
}

export function Toaster() {
  return (
    <ToastProvider swipeDirection="right">
      <ToastProviderInternal>
        <ToastBridge />
        <ToastList />
        <ToastViewport />
      </ToastProviderInternal>
    </ToastProvider>
  )
}
