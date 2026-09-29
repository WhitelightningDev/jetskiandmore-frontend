export const SITE_ORIGIN = 'https://www.jetskiandmore.com'

export const OPENING_DATE_ISO = '2026-10-20'
export const OPENING_DATE_LABEL = 'Tuesday, 20 October 2026'
const OPENING_AT = new Date(`${OPENING_DATE_ISO}T00:00:00+02:00`).getTime()

export function isBeforeOpeningDate(now = Date.now()) {
  return now < OPENING_AT
}
