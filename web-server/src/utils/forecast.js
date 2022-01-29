const request = require('request')

const weatherAccessKey = 'fb6222843ba3793d5b3b1c6ffd0710fa';

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=' + weatherAccessKey + '&query=' + latitude + ',' + longitude + '&units=f'

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (response.body.error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, response.body.current.weather_descriptions[0] + ". It is currently " + response.body.current.temperature + " degress out, with humidity: " + response.body.current.humidity)
        }
    })
}

module.exports = forecast