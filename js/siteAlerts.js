// site alerts

'use strict';

const alertHub = new signalR.HubConnectionBuilder().withUrl('/alertHub').build();
const siteAlertMessageList = document.getElementById('siteAlertMessageList');
const siteAlertText = document.getElementById('siteAlertText');
const siteAlertDisplay = document.getElementById('siteAlertDisplay');
let siteAlertCount = 0;

alertHub.on('ReceiveMessage', function (user, message) {
    addAlertMessage(`From ${user}: ${message}`);
    siteAlertText.textContent = `Alerts: (${++siteAlertCount})`;
})

alertHub.start().then(function () {
    //addAlertMessage('Connected'); do not show connected message
}).catch(function (err) {
    addAlertMessage(err.toString());
});

siteAlertText.addEventListener('click', function (event) {
    alertHub.invoke('SendMessage', 'Browser', new Date()).catch(function (err) {
        return console.error(err.toString());
    });
});

function addAlertMessage(message) {
    let li = document.createElement('li');
    siteAlertMessageList.insertBefore(li, siteAlertMessageList.firstChild);
    li.textContent = message;

    siteAlertDisplay.innerHTML = message;
    siteAlertDisplay.classList.add('show');

    setTimeout(function () {
        siteAlertDisplay.classList.remove('show');
    }, 3000);
}