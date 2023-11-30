
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
    fetch_args = {}
    for (const [key, val] of Object.entries(user)) {
        fetch_args[key] = val;
    };
    await fetch('http://127.0.0.1:8080/login?' + new URLSearchParams(fetch_args),
        { credentials: 'include' }
    );
    return true
}


function _getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
}

// function getCookie(name) {
//     function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
//     var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
//     return match ? match[1] : null;
// }


async function getInitData() {
    const response = await fetch('http://127.0.0.1:8080/birthdays',
        {
            headers: { 'X-CSRF-TOKEN': _getCookie('csrf_access_token') },
            method: "GET",
            credentials: "include"
        });
    const data = await response.json();
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
    apiAuth(user).then(function () { getInitData() })
        .then(document.getElementById('widget').style.display = 'none')
    alert('Logged in as ' + user.first_name);
}

renderCalendar();