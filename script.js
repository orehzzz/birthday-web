
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


async function apiAuth(user) {
    return new Promise(function (resolve, reject) {
        fetch_args = {}
        for (const [key, val] of Object.entries(user)) {
            fetch_args[key] = val;
        }
        fetch('http://127.0.0.1:8080/login?' + new URLSearchParams(fetch_args));
        resolve();
    });
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


async function getData() {
    console.log("data start")
    const response = await fetch('http://127.0.0.1:8080/birthdays',
        {
            headers: { 'X-CSRF-TOKEN': getCookie('csrf_access_token') },
            method: "GET"
        });
    const data = await response.json();
    console.log(data)
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
    apiAuth(user).then(function () { getData() })
    // alert('Logged in as ' + user.first_name);
}

renderCalendar();