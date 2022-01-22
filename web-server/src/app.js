const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Shivam Rajvir'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Shivam Rajvir'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Shivam Rajvir'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide address term'
        })
    }

    let address = req.query.address
    geocode(address, (error, { latitude, longitude, location }) => {
            if (error) {
                console.error(error)
                return res.send({
                    error: error
                })
            }

            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    console.error(error)
                    return res.send({
                        error: error
                    })
                }

                console.log(location)
                console.log(forecastData)
                res.send({
                    location: location,
                    forecast: forecastData
                })
            })
        })
        // res.send({
        //     forecast: 'It is snowing',
        //     location: 'Philadelphia'
        // })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        res.send({
            error: 'You must provide search term'
        })
    } else {
        geocode(req.query.search, (error, { latitude, longitude, location }) => {
            if (error) {
                return console.log(error)
            }

            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return console.log(error)
                }

                console.log(location)
                console.log(forecastData)
                res.send({
                    location: location,
                    forecastData: forecastData
                })
            })
        })

    }

})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Shivam Rajvir',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Shivam Rajvir',
        errorMessage: 'Page not found.'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})