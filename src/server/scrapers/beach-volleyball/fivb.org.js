/* eslint-disable */
const Nightmare = require('nightmare');

export const url = 'http://www.fivb.org/EN/BeachVolleyball/Competitions/WorldTour/2016/event/Results.asp?TournCode=MANT2016&Phase=2';

export function scrape (cb) {
  const nightmare = Nightmare({ show: false })
  nightmare
    .goto(url)
    .wait('h1 ~ table tbody')
    .evaluate((url) => {
      function toDate(rawDate, rawTime) {
        const date = `0${parseInt(rawDate, 10)}`.slice(-2);
        const month = ('0' + ([
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ].indexOf((rawDate.match(/\w+$/) || [])[0] || 'Jan') + 1)).slice(-2);
        const year = 2016;
        const hours = `0${parseInt(rawTime, 10)}`.slice(-2);
        const minutes = ('0' + (rawTime.match(/\d+$/) || [])[0] || '0').slice(-2);

        return new Date(`${year}-${month}-${date}T${hours}:${minutes}:00+0300`);
      }

      return [].slice.call(document.querySelectorAll('h1 ~ table tbody tr'), 0)
          // Remove headline rows
          .filter(e => e.children.length > 1)

          // Normalize data
          .map(e => {
            const startTime = toDate(e.querySelector('td:nth-child(2)').innerText, e.querySelector('td:nth-child(3)').innerText);
            const endTime = new Date(startTime.getTime());
            endTime.setHours(endTime.getHours() + 1);
            return {
              category: 'Pludmales volejbols',
              start_time: startTime.toUTCString(),
              end_time: endTime.toUTCString(),
              title: e.querySelector('td:nth-child(5)').innerText + " vs " + e.querySelector('td:nth-child(6)').innerText,
              scraped_from: url,
              place: 'Antalya',
              attributes: {}
            };
          })

          // Only events with lv guys
          .filter(e => /(Samoilovs|Plavins|Finsters)/.test(e.title));
    }, url)
    .end()
    .then(result => {
      cb(null, result);
    })
    .catch(err => {
      cb(err);
    });
}
