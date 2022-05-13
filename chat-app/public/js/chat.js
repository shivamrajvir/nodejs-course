// const socket = io()

// socket.on('countUpdated', (count) => {
//     console.log('Count', count)
// })

// function incrementCount() {
//     socket.emit('increment')
// }

// socket.on('message', (message) => {
//     console.log('message', message)
// })

// socket.on('sendMessage', (message) => {
//     console.log(message)
// })

const socket = io()



// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationBtn = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    const $newMessage = $messages.lastElementChild;

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom, 10)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    const containerHeight = $messages.scrollHeight;
    const visibleHeight = $messages.offsetHeight;
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (messageObj) => {
    console.log(messageObj)
    const html = Mustache.render(messageTemplate, {
        message: messageObj.text,
        createdAt: moment(messageObj.createdAt).format('h:mm a'),
        username: messageObj.username
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', (locationObj) => {
    console.log(locationObj)
    const html = Mustache.render(locationMessageTemplate, {
        location: locationObj.location,
        createdAt: moment(locationObj.createdAt).format('h:mm a'),
        username: locationObj.username
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.error(error)
        }
        console.log('delivered')
    })
})

$sendLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) { alert('Geo loc not supported') }
    $sendLocationBtn.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendLocation', { lat: position.coords.latitude, long: position.coords.longitude }, (ack) => {
            console.log('Location shared');
            $sendLocationBtn.removeAttribute('disabled')
        });
    })
})


socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})