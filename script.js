

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        firstDay: '1',
        headerToolbar: {
            right: 'today prev,next'
        },
    });
    calendar.render();
});

function onTelegramAuth(user) {
    //make a request to api
    alert('Logged in as ' + user.first_name);
}