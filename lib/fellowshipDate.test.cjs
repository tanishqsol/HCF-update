const assert = require("node:assert/strict")
const test = require("node:test")

const {
  formatFellowshipDate,
  getFellowshipDateInfo,
  getNextFellowshipDate,
  getThirdSaturday,
} = require("./fellowshipDate.cjs")

test("finds the third Saturday of a month", () => {
  assert.equal(formatFellowshipDate(getThirdSaturday(2026, 7)).full, "Saturday, 15th August, 2026")
  assert.equal(formatFellowshipDate(getThirdSaturday(2026, 8)).full, "Saturday, 19th September, 2026")
})

test("keeps the current meeting before the third Saturday", () => {
  const date = getNextFellowshipDate(new Date(2026, 7, 14, 23, 59))

  assert.equal(formatFellowshipDate(date).full, "Saturday, 15th August, 2026")
})

test("keeps the current meeting throughout the third Saturday", () => {
  const date = getNextFellowshipDate(new Date(2026, 7, 15, 23, 59))

  assert.equal(formatFellowshipDate(date).full, "Saturday, 15th August, 2026")
})

test("rolls to next month on the Sunday after the third Saturday", () => {
  const date = getNextFellowshipDate(new Date(2026, 7, 16, 0, 0))

  assert.equal(formatFellowshipDate(date).full, "Saturday, 19th September, 2026")
})

test("rolls across the year boundary", () => {
  const info = getFellowshipDateInfo(new Date(2026, 11, 20, 0, 0))

  assert.equal(info.title, "January 16")
  assert.equal(info.full, "Saturday, 16th January, 2027")
})
