import { Link } from '@tanstack/react-router'
import { Waves, Phone, Mail, Anchor, CalendarClock } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import jetskilogo from '@/lib/images/JetSkiLogo.png'

export default function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-b from-background via-background to-primary/10 border-t border-primary/10 text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30 overflow-hidden">
                <img src={jetskilogo} alt="JetSki & More" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-primary font-semibold">Jet Ski & More</p>
                <h3 className="text-2xl font-black tracking-tight">Ride the waves, skip the hassle.</h3>
              </div>
            </div>
            <p className="text-foreground/70 max-w-2xl">
              Premium rentals, guided rides, and weather-ready support so you can focus on carving up perfect blue water.
              We prep the skis, you bring the thrill.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/Bookings"
                className={`${buttonVariants({ size: 'sm' })} shadow-[0_16px_40px_-22px_rgba(16,185,129,0.75)]`}
              >
                <CalendarClock className="mr-2" size={16} />
                Book a slot
              </Link>
              <Link
                to="/contact"
                className={`${buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                })} border-primary/30 shadow-[0_10px_30px_-20px_rgba(59,130,246,0.35)]`}
              >
                <Phone className="mr-2" size={16} />
                Talk with us
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-3">Quick links</h4>
            <div className="space-y-2">
              {[
                { to: '/home', label: 'Home' },
                { to: '/rides', label: 'Rides' },
                { to: '/safety', label: 'Safety' },
                { to: '/weather', label: 'Weather' },
                { to: '/contact', label: 'Contact' },
                { to: '/admin', label: 'Admin' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex items-center gap-2 text-foreground/75 hover:text-foreground transition-colors"
                >
                  <span className="h-[1px] w-4 bg-primary/30 transition-all duration-200 group-hover:w-6" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-3">Need a hand?</h4>
            <div className="space-y-3 text-foreground/80">
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <a href="tel:+27746588885" className="hover:text-foreground">
                  +27 (074) 658 8885
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <a href="mailto:info@jetskiandmore.com" className="hover:text-foreground">
                  jetskiadventures1@gmail.com
                </a>
              </p>
              <p className="flex items-start gap-2">
                <Anchor size={16} className="text-primary mt-1" />
                <span>
                  Daily launches on at Gordons Bay Harbour with certified skippers ready to guide you when needed.
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Waves size={16} className="text-primary" />
                Live weather + safety briefings included with every booking.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-sm text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Jet Ski & More. All wakes reserved.</span>
          <div className="flex gap-4">
            <Link to="/safety" className="hover:text-foreground">
              Safety standards
            </Link>
            <Link to="/contact" className="hover:text-foreground">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
