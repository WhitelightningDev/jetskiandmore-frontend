import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Home,
  Menu,
  X,
  Waves,
  ShieldCheck,
  Phone,
  CalendarDays,
  Sparkles,
  ArrowRight,
  Ship,
  Fish,
  CloudSun,
  MoreHorizontal,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import jetskilogo from '@/lib/images/JetSkiLogo.png'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-background/95 via-background/90 to-background/95 text-foreground border-b border-primary/10 shadow-[0_20px_45px_-35px_rgba(14,116,144,0.55)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl w-full px-4">
          <div className="h-16 w-full flex items-center gap-3 rounded-full px-4 bg-foreground/[0.03] border border-border/60 shadow-[0_8px_30px_-20px_rgba(15,23,42,0.6)] backdrop-blur">
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
            <nav className="hidden md:flex items-center gap-2 ml-4 px-2 py-1 rounded-full bg-background/70 border border-border/60 shadow-inner shadow-primary/5">
              {[
                { to: '/home', label: 'Home' },
                { to: '/rides', label: 'Jet ski Rides' },
                { to: '/boat-ride', label: 'Boat ride' },
                { to: '/fishing-charters', label: 'Fishing charters' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeProps={{
                    className:
                      'relative px-4 py-2 rounded-full text-sm font-semibold text-primary bg-primary/15 border border-primary/30 shadow-[0_10px_30px_-18px_rgba(16,185,129,0.7)]',
                  }}
                  className="relative px-4 py-2 rounded-full text-sm font-semibold text-foreground/75 transition-all duration-200 border border-transparent hover:text-foreground hover:bg-primary/10 hover:border-primary/30 hover:-translate-y-[1px] shadow-[0_1px_0_0_rgba(255,255,255,0.06)]"
                >
                  {item.label}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative px-4 py-2 rounded-full text-sm font-semibold text-foreground/75 transition-all duration-200 border border-transparent hover:text-foreground hover:bg-primary/10 hover:border-primary/30 hover:-translate-y-[1px] shadow-[0_1px_0_0_rgba(255,255,255,0.06)] flex items-center gap-2">
                    <MoreHorizontal className="h-4 w-4" />
                    More
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px] border-primary/20 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.55)]">
                  <DropdownMenuItem asChild>
                    <Link to="/weather" className="flex items-center gap-2">
                      <CloudSun className="h-4 w-4" /> Weather
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/safety" className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Safety
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Admin
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-3">
              <Link
                to="/contact"
                className={`${buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                })} border-primary/30 shadow-[0_10px_30px_-20px_rgba(59,130,246,0.35)] transition-transform hover:-translate-y-[1px]`}
              >
                <Phone className="mr-2" size={16} /> Contact
              </Link>
              <Link
                to="/Bookings"
                className={`${buttonVariants({
                  size: 'sm',
                })} shadow-[0_16px_40px_-22px_rgba(16,185,129,0.75)] transition-transform hover:-translate-y-[1px]`}
              >
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
        className={`fixed top-0 left-0 h-full w-80 sm:w-96 bg-gradient-to-b from-background via-background/95 to-primary/8 text-foreground border-r border-primary/10 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.6)] backdrop-blur-xl rounded-r-3xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-primary/10 bg-foreground/[0.02]">
          <div>
            <h2 className="text-xl font-bold">Menu</h2>
            <p className="text-sm text-foreground/60">Navigate the water with ease</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-foreground/[0.02] p-4 mb-5 shadow-[0_12px_35px_-24px_rgba(16,185,129,0.65)]">
            <div className="absolute inset-0 opacity-60 bg-gradient-to-r from-primary/15 via-sky-500/10 to-background blur-3xl" />
            <div className="relative flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles size={14} />
              Ride-ready briefings
            </div>
            <h3 className="relative mt-3 text-lg font-semibold text-foreground">Book, show up, and launch in minutes.</h3>
            <p className="relative mt-2 text-sm text-foreground/70">
              Safety checklist, weather review, and gear included for every session.
            </p>
            <div className="relative mt-3 flex gap-3">
              <Link
                to="/Bookings"
                onClick={() => setIsOpen(false)}
                className={`${buttonVariants({
                  size: 'sm',
                })} shadow-[0_16px_40px_-22px_rgba(16,185,129,0.75)]`}
              >
                <CalendarDays className="mr-2" size={16} /> Book now
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={`${buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                })} border-primary/30 shadow-[0_10px_30px_-20px_rgba(59,130,246,0.35)]`}
              >
                <Phone className="mr-2" size={16} /> Talk to us
              </Link>
            </div>
          </div>

          {[
            { to: '/home', label: 'Home', icon: <Home size={20} /> },
            { to: '/rides', label: 'Rides', icon: <Waves size={20} /> },
            { to: '/boat-ride', label: 'Boat ride', icon: <Ship size={20} /> },
            { to: '/fishing-charters', label: 'Fishing charters', icon: <Fish size={20} /> },
            { to: '/safety', label: 'Safety', icon: <ShieldCheck size={20} /> },
            { to: '/weather', label: 'Weather', icon: <Waves size={20} /> },
            { to: '/admin', label: 'Admin', icon: <ShieldCheck size={20} /> },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/40 bg-background/60 hover:border-primary/40 hover:bg-primary/8 transition-all mb-2 shadow-[0_4px_18px_-15px_rgba(15,23,42,0.6)]"
              activeProps={{
                className:
                  'group flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-primary/50 bg-primary/12 text-primary hover:bg-primary/12 transition-all mb-2 shadow-[0_10px_30px_-18px_rgba(16,185,129,0.7)]',
              }}
            >
              <span className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </span>
              <ArrowRight
                size={18}
                className="text-foreground/40 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary"
              />
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
