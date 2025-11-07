import { useEffect, useRef, useState } from 'react'
import { Mail, MessageCircle, X, MessageSquareMore } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ContactFab() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [open])

  const waText = encodeURIComponent('Hi! I have a question about bookings.')
  const waNumber = '27756588885' // +27 756 588 885 without the plus sign for wa.me
  const emailTo = 'jetskiadventures1@gmail.com'
  const emailSubject = encodeURIComponent('Jet Ski booking enquiry')
  const emailBody = encodeURIComponent('Hi! I have a question about bookings.')

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed z-50 right-4 bottom-4 md:right-6 md:bottom-6',
        'flex flex-col items-end gap-2'
      )}
    >
      {/* Action bubbles */}
      <div
        id="contact-fab-bubbles"
        className={cn('flex flex-col items-end gap-2', open ? 'pointer-events-auto' : 'pointer-events-none')}
      >
        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?phone=${waNumber}&text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-2 rounded-full shadow-md ring-1 ring-border',
            'bg-emerald-500 text-white hover:bg-emerald-600',
            'px-3 py-2 text-sm font-medium transition-all',
            open
              ? 'opacity-100 translate-y-0 animate-in fade-in slide-in-from-bottom-4 duration-200'
              : 'opacity-0 translate-y-2'
          )}
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Email */}
        <a
          href={`mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`}
          className={cn(
            'inline-flex items-center gap-2 rounded-full shadow-md ring-1 ring-border',
            'bg-primary text-primary-foreground hover:brightness-95',
            'px-3 py-2 text-sm font-medium transition-all',
            open
              ? 'opacity-100 translate-y-0 animate-in fade-in slide-in-from-bottom-2 duration-200 delay-75'
              : 'opacity-0 translate-y-2'
          )}
          aria-label="Send us an email"
        >
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Email</span>
        </a>
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="contact-fab-bubbles"
        aria-label={open ? 'Close contact options' : 'Open contact options'}
        className={cn(
          'pointer-events-auto inline-flex items-center justify-center',
          'h-14 w-14 rounded-full shadow-lg ring-1 ring-border',
          'bg-foreground text-background hover:brightness-95 transition-all',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
      >
        <span className={cn('transition-transform duration-200', open ? 'scale-0' : 'scale-100')}>
          <MessageSquareMore className="h-6 w-6" />
        </span>
        <span className={cn('absolute transition-transform duration-200', open ? 'scale-100' : 'scale-0')}>
          <X className="h-6 w-6" />
        </span>
      </button>
    </div>
  )
}
