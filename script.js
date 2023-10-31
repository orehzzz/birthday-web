
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

async function onTelegramAuth(user) {
    //make a request to api
    const response = await fetch('http://127.0.0.1:8080/birthdays');
    const data = await response.json();
    console.log(data);
    const date = new Date();
    for (let i = 0; i < data.length; i++) {
        calendar.addEvent({
            title: data['name'],
            start: `${date.getFullYear()}-${data['month']}-${data['day']}`,
            allDay: true
        });
    }
    alert('Logged in as ' + user.first_name);
}