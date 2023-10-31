
var calendar;

function renderCalendar() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        firstDay: '1',
        headerToolbar: {
            right: 'today prev,next'
        },
    });
    calendar.render();
};

async function getData() {
    const response = await fetch('http://127.0.0.1:8080/birthdays');
    const data = await response.json();
    console.log(data);
    const date = new Date();
    for (let i = 0; i < data.length; i++) {
        let name = data[i]['name'];
        let year = date.getFullYear();
        let month = data[i]['month'];
        let day = data[i]['day'].toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        calendar.addEvent({
            title: name,
            start: `${year}-${month}-${day}`,
            allDay: true
        }); // maybe add for this and next year
    }
};

function onTelegramAuth(user) {
    //function for checking hash
    //api request for token
    getData()
    alert('Logged in as ' + user.first_name);
};

renderCalendar();