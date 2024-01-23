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


function _minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
}


async function getInitData() {
    const response = await fetch('http://127.0.0.1:8080/birthdays',
        {
            headers: { 'X-CSRF-TOKEN': _getCookie('csrf_access_token') },
            method: "GET",
            credentials: "include"
        });
    var data = await response.json();
    for (let i = 0; i < data.length; i++) {
        _addEvent(data[i])
    }
};


async function onTelegramAuth(user) {
    await apiAuth(user)
    await getInitData()
    await fillDelSelect()
        // alert('Logged in as ' + user.first_name);
        .then(document.getElementById('widget').style.display = 'none')
}


async function createBirthday() {
    const request_data = {
        "name": document.getElementById('add_name').value,
        "day": document.getElementById('add_day').value,
        "month": document.getElementById('add_month').value,
        "year": document.getElementById('add_year').value,
        "note": document.getElementById('add_note').value
    }
    await fetch('http://127.0.0.1:8080/birthdays',
        {
            headers: {
                'X-CSRF-TOKEN': _getCookie('csrf_access_token'),
                "Content-Type": "application/json",
            },
            method: "POST",
            credentials: "include",
            body: JSON.stringify(request_data)
        }).then(response => response.json()).then(resp_data => _addEvent(resp_data));
}

function _addEvent(data_obj) {
    const day = _minTwoDigits(data_obj['day'])
    const month = _minTwoDigits(data_obj['month'])
    const date = new Date();
    const year = date.getFullYear();
    calendar.addEvent({
        title: data_obj['name'],
        start: `${year}-${month}-${day}`,
        allDay: true
    });
}

async function fillDelSelect() {
    const selectElement = document.getElementById('del_select');
    const events = calendar.getEvents()
    events.forEach(element => selectElement.add(new Option(element.title)));
}

async function deleteBirthday() {
    const selectElement = document.getElementById('del_select');
    const events = calendar.getEvents()
    for (let i = 0; i < events.length; i++) {
        if (events[i].title === selectElement.value) {
            const del_data = events[i]
            const response = await fetch(`http://127.0.0.1:8080/birthdays/${del_data.title}`,
                {
                    headers: {
                        'X-CSRF-TOKEN': _getCookie('csrf_access_token'),
                        "Content-Type": "text/plain", //application/json
                    },
                    method: "DELETE",
                    credentials: "include",
                })
            if (response.status === 204) {
                for (let i = 0; i < selectElement.options.length; i++) {
                    if (selectElement.options[i].value === del_data.title) {
                        selectElement.remove(i);
                        break;
                    }
                }
                del_data.remove()
            }
            break;
        }
        // calendar.getElementById("")
    };
}


renderCalendar();