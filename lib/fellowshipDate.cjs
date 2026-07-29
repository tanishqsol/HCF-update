const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const getOrdinalSuffix = (day) => {
  if (day >= 11 && day <= 13) return "th"

  switch (day % 10) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    default:
      return "th"
  }
}

const getThirdSaturday = (year, monthIndex) => {
  const firstDay = new Date(year, monthIndex, 1)
  const daysUntilSaturday = (6 - firstDay.getDay() + 7) % 7

  return new Date(year, monthIndex, 1 + daysUntilSaturday + 14)
}

const getNextFellowshipDate = (today = new Date()) => {
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  const currentThirdSaturday = getThirdSaturday(currentYear, currentMonth)
  const dayAfterCurrentMeeting = new Date(
    currentThirdSaturday.getFullYear(),
    currentThirdSaturday.getMonth(),
    currentThirdSaturday.getDate() + 1,
  )

  if (today < dayAfterCurrentMeeting) {
    return currentThirdSaturday
  }

  return getThirdSaturday(currentYear, currentMonth + 1)
}

const formatFellowshipDate = (date) => {
  const weekday = WEEKDAY_NAMES[date.getDay()]
  const month = MONTH_NAMES[date.getMonth()]
  const day = date.getDate()

  return {
    title: `${month} ${day}`,
    full: `${weekday}, ${day}${getOrdinalSuffix(day)} ${month}, ${date.getFullYear()}`,
  }
}

const getFellowshipDateInfo = (today = new Date()) => {
  const date = getNextFellowshipDate(today)

  return {
    date,
    ...formatFellowshipDate(date),
  }
}

module.exports = {
  formatFellowshipDate,
  getFellowshipDateInfo,
  getNextFellowshipDate,
  getThirdSaturday,
}
