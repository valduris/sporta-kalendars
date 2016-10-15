const Nightmare = require('nightmare')

export const url = 'http://basket.lv/lbl1/show-schedule-long'

export function scrape (cb) {
  const nightmare = Nightmare({ show: false })
  nightmare
    .goto(url)
    .wait('.mbt-schedule-widget td')
    .on('console', (type, msg) => console[type](msg))
    .evaluate((url) => {
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()

      function toDate (rawDateTime) {
        const parts = rawDateTime.split(' ')
        const date = parts[0].split('-')[1]
        const month = parts[0].split('-')[0]
        const year = parseFloat(month) < currentMonth ? currentYear + 1 : currentYear

        return new Date(`${year}-${month}-${date}T${parts[1]}:00+0300`)
      }

      return [].slice.call(document.querySelectorAll('[id*="schedule-line-container"]'))
          // Normalize data
          .map(e => {
            const startTime = toDate(e.querySelector('td:first-child').innerText)
            const endTime = new Date(startTime.getTime())
            endTime.setHours(endTime.getHours() + 2)
            return {
              category: 'Basketbols',
              start_time: startTime.toUTCString(),
              end_time: endTime.toUTCString(),
              title: `${e.querySelector('td:nth-child(2)').innerText} vs ${e.querySelector('td:nth-child(4)').innerText}`,
              scraped_from: url,
              place: e.querySelector('td:nth-child(4)').innerText,
              attributes: {}
            }
          })
    }, url)
    .end()
    .then(result => {
      cb(null, result)
    })
    .catch(err => {
      cb(err)
    })
}
