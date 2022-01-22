// const request = require('request');

// const weatherApiUrl = 'http://api.weatherstack.com/current';
// const weatherAccessKey = 'fb6222843ba3793d5b3b1c6ffd0710fa';

// const geoLocationAccessToken = 'pk.eyJ1Ijoic2hpdmFtcmFqdmlyIiwiYSI6ImNreDFveXpqcTFqbjQybnVyaXRoMGpxY3AifQ.7FJ_wLamBhe3z7LL-uuQtA'

// const geoLocationUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/rajkot.json?access_token=' + geoLocationAccessToken + '&limit=1';

// request.get({
//     url: geoLocationUrl,
//     json: true
// }, (error, response) => {
//     if (error) {

//     } else {
//         console.log(response.body.features[0].center);
//     }
// })

// request.get({
//     url: weatherApiUrl + '?access_key=' + weatherAccessKey + '&query=Rajkot',
//     json: true
// }, (error, response) => {
//     let data = JSON.parse(response.body);
//     console.log(response.body.current);
//     console.log('It is currently ' + response.body.current.temperature + ' degress out. It feels like ' + response.body.current.feelslike + ' degress out.')
// })
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const address = process.argv[2]

if (!address) {
    console.log('Please provide an address')
} else {
    geocode(address, (error, { latitude, longitude, location }) => {
        if (error) {
            return console.log(error)
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return console.log(error)
            }

            console.log(location)
            console.log(forecastData)
        })
    })
}