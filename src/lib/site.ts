export const SITE_ORIGIN = 'https://www.jetskiandmore.com'

export const OPENING_DATE_LABEL = 'Tuesday, 20 October 2026'
const OPENING_AT = new Date('2026-10-20T00:00:00+02:00').getTime()

export function isBeforeOpeningDate(now = Date.now()) {
  return now < OPENING_AT
}
