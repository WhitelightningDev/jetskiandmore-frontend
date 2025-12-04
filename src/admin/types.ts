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
  passengers?: { name?: string }[] | null
  status: string
  amountInCents: number
  createdAt?: string | null
}

export type RideStat = {
  rideId: string
  bookings: number
  revenueInCents: number
}

export type AnalyticsSummary = {
  totalBookings: number
  totalRevenueInCents: number
  totalRevenueZar: number
  totalPageViews: number
  rides: RideStat[]
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
  hasWatchedTutorial: boolean
  hasAcceptedIndemnity: boolean
  quizAnswers: Record<string, any>
  createdAt?: string | null
}

export type AdminOutletContext = {
  token: string | null
  bookings: Booking[]
  analytics: AnalyticsSummary | null
  quizSubs: QuizSubmission[]
  loadingBookings: boolean
  loadingMeta: boolean
  error: string | null
  setError: Dispatch<SetStateAction<string | null>>
  statusFilter: string | 'all'
  setStatusFilter: Dispatch<SetStateAction<string | 'all'>>
  updateBookingStatus: (id: string, status: string, message: string) => Promise<boolean>
  deleteBooking: (id: string) => Promise<void>
  handleLogout: () => void
}
