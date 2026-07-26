import type { Dispatch, SetStateAction } from 'react'

export type Booking = {
  id: string
  rideId: string
  date?: string | null
  time?: string | null
  fullName: string
  email: string
  phone: string
  notes?: string | null
  addons?: Record<string, any> | null
  passengers?: Array<{ name?: string }> | null
  status: string
  amountInCents: number
  createdAt?: string | null
  bookingReference?: string | null
  numberOfJetSkis?: number | null
  riders?: Array<{ name?: string; email?: string }> | null
  // Indemnity progress across active (non-removed) participants
  indemnitySignedCount?: number
  indemnityTotalCount?: number
  indemnityRemovedCount?: number
  refundedAmountInCents?: number
}

export type RideStat = {
  rideId: string
  bookings: number
  revenueInCents: number
}

export type BookingStatusStat = {
  status: string
  bookings: number
}

export type MonthlyBookingStat = {
  month: string
  bookings: number
  revenueInCents: number
}

export type PageViewAnalyticsItem = {
  path: string
  views: number
  uniqueSessions: number
  totalDurationSeconds: number
  avgDurationSeconds?: number | null
  firstSeen?: string | null
  lastSeen?: string | null
}

export type PageViewAnalytics = {
  items: Array<PageViewAnalyticsItem>
  totalViews: number
  totalUniqueSessions: number
  totalUniqueVisitors: number
  breakdowns: PageViewBreakdowns
}

export type CountStat = {
  key: string
  count: number
}

export type TimeOfDayStat = {
  hour: number
  views: number
}

export type ReturningStat = {
  newVisitors: number
  returningVisitors: number
  totalVisitors: number
}

export type PageViewBreakdowns = {
  countries: Array<CountStat>
  cities: Array<CountStat>
  deviceTypes: Array<CountStat>
  os: Array<CountStat>
  browsers: Array<CountStat>
  languages: Array<CountStat>
  timeOfDay: Array<TimeOfDayStat>
  returning: ReturningStat
}

export type AnalyticsSummary = {
  totalBookings: number
  totalRevenueInCents: number
  totalRevenueZar: number
  totalPageViews: number
  averageBookingValueInCents: number
  refundedAmountInCents: number
  uniqueCustomers: number
  repeatCustomers: number
  upcomingBookings: number
  jetSkisBooked: number
  bookingsThisMonth: number
  revenueThisMonthInCents: number
  bookingsPreviousMonth: number
  revenuePreviousMonthInCents: number
  indemnitiesSigned: number
  indemnitiesRequired: number
  statusCounts: Array<BookingStatusStat>
  monthly: Array<MonthlyBookingStat>
  rides: Array<RideStat>
}

export type QuizSubmission = {
  id: string
  email: string
  name: string
  surname: string
  idNumber: string
  passengerName?: string | null
  passengerSurname?: string | null
  passengerEmail?: string | null
  passengerIdNumber?: string | null
   passengers?: Array<{
    name?: string | null
    surname?: string | null
    email?: string | null
    idNumber?: string | null
  }> | null
  hasWatchedTutorial: boolean
  hasAcceptedIndemnity: boolean
  quizAnswers: Record<string, any>
  createdAt?: string | null
}

export type AdminOutletContext = {
  token: string | null
  bookings: Array<Booking>
  analytics: AnalyticsSummary | null
  quizSubs: Array<QuizSubmission>
  pageViews: PageViewAnalytics | null
  loadingBookings: boolean
  loadingMeta: boolean
  loadingPageViews: boolean
  error: string | null
  setError: Dispatch<SetStateAction<string | null>>
  statusFilter: string | 'all'
  setStatusFilter: Dispatch<SetStateAction<string | 'all'>>
  updateBookingStatus: (id: string, status: string, message: string) => Promise<boolean>
  deleteBooking: (id: string) => Promise<void>
  handleLogout: () => void
}
