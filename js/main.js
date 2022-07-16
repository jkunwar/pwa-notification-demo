if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/pwa-notification-demo/service-worker.js', { scope: '/pwa-notification-demo/' })
        .then((registration) => { console.log(registration) })
        .catch(err => console.log(err));

} else {
    console.log('Service worker is not supported.')
}

const formContainer = document.getElementById('formContainer');
const sendNotification = document.getElementById('sendNotification');

// check for notificaiton permission when page loads
if ('Notification' in window && 'serviceWorker' in navigator) {
    const permission = Notification.permission
    switch (permission) {
        case 'granted':
            formContainer.style.display = 'block'
            sendNotification.style.display = 'none'
            break
        case 'denied':
            sendNotification.style.display = 'block'
            break
        case 'default':
            break
    }

} else {
    sendNotification.style.display = 'none'
    alert("This browser does not support desktop notification")
}

// ask for permission
sendNotification.addEventListener('click', requestPermission)
function requestPermission() {
    Notification.requestPermission().then(permission => {
        if (permission == 'granted') {
            formContainer.style.display = 'block'
            sendNotification.style.display = 'none'

        } else {
            formContainer.style.display = 'none'
            sendNotification.style.display = 'block'
        }
    }).catch(error => console.log('ERROR: ', error))
}

const sendBtn = document.getElementById('send');
sendBtn.addEventListener('click', () => {
    const title = document.getElementsByName('title')[0].value
    const body = document.getElementsByName('body')[0].value

    const options = {
        body: body,
        actions: [
            {
                action: 'agree',
                title: 'Agree',
                icon: '/notificationDemo/images/tick.png'
            },
            {
                action: 'disagree',
                title: 'Diagree',
                icon: '/notificationDemo/images/cross.png'
            }
        ]
    }

    // new Notification(title, options)
    navigator.serviceWorker.ready
        .then((registration) => {
            registration.showNotification(title, options)
        })

})

// show message from service worker to the client
navigator.serviceWorker.addEventListener('message', function (message) {
    const actionMessage = document.getElementById('actionMessage');
    actionMessage.innerHTML = message.data
});