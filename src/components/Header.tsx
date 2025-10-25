import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Home, Menu, X, Waves, MapPin, ShieldCheck, Phone, CalendarDays } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import jetskilogo from '@/lib/images/JetSkiLogo.png'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-background text-foreground border-b border-border/80 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-7xl w-full px-4">
          <div className="h-16 flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open menu"
              aria-controls="main-drawer"
              aria-expanded={isOpen}
            >
              <Menu size={22} />
            </button>

            {/* Brand */}
            <Link to="/home" className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30 ring-1 ring-border overflow-hidden">
                <img
                  src={jetskilogo}
                  alt="JetSki & More"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span className="hidden sm:inline text-lg font-semibold tracking-tight">JET SKI AND MORE</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-2 ml-4">
              {[
                { to: '/home', label: 'Home' },
                { to: '/rides', label: 'Rides' },
                { to: '/locations', label: 'Locations' },
                { to: '/safety', label: 'Safety' },
                { to: '/weather', label: 'Weather' },
                { to: '/contact', label: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeProps={{ className: 'bg-primary/10 text-primary' }}
                  className="px-3 py-1.5 rounded-full text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-3">
              <Link to="/contact" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                <Phone className="mr-2" size={16} /> Contact
              </Link>
              <Link to="/Bookings" className={buttonVariants({ size: 'sm' })}>
                <CalendarDays className="mr-2" size={16} /> Book now
              </Link>
            </div>
          </div>
        </div>
      </header>
      {isOpen && (
        <button
          className="fixed inset-0 bg-black/50 z-40"
          aria-label="Close menu backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        id="main-drawer"
        className={`fixed top-0 left-0 h-full w-80 bg-background text-foreground border-r border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/80">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {[
            { to: '/home', label: 'Home', icon: <Home size={20} /> },
            { to: '/rides', label: 'Rides', icon: <Waves size={20} /> },
            { to: '/locations', label: 'Locations', icon: <MapPin size={20} /> },
            { to: '/safety', label: 'Safety', icon: <ShieldCheck size={20} /> },
            { to: '/weather', label: 'Weather', icon: <Waves size={20} /> },
            { to: '/contact', label: 'Contact', icon: <Phone size={20} /> },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/10 transition-colors mb-2',
              }}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <div className="mt-4 pt-4 border-t border-border/80">
            <Link to="/Bookings" onClick={() => setIsOpen(false)} className={buttonVariants({ size: 'default' })}>
              <CalendarDays className="mr-2" size={18} /> Book now
            </Link>
          </div>
        </nav>
      </aside>
    </>
  )
}
