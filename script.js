var calendar;


function renderCalendar() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'multiMonthYear',
        views: {
            listYear: { buttonText: 'list' },
            multiMonthYear: { buttonText: 'calendar' },
        },
        firstDay: '1',
        headerToolbar: {
            right: 'listYear,multiMonthYear'
        },
        dayMaxEvents: true,
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
    await fillSelect()
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
    if (request_data['year'] === (undefined || '')) {
        delete request_data['year']
    }
    if (request_data['note'] === (undefined || '')) {
        delete request_data['note']
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
    fillSelect();
}


function _addEvent(data_obj) {
    const day = _minTwoDigits(data_obj['day'])
    const month = _minTwoDigits(data_obj['month'])
    const date = new Date();
    const yearCurrent = date.getFullYear();
    calendar.addEvent({
        title: data_obj['name'],
        start: `${yearCurrent}-${month}-${day}`,
        allDay: true,
        extendedProps: {
            id: data_obj['id'],
            note: data_obj['note'],
            yearBirth: data_obj['year']
        }
    });
}


async function fillSelect() {
    const selectElements = [document.getElementById('change_select'), document.getElementById('del_select')];
    const events = calendar.getEvents()
    selectElements.forEach(element => {
        while (element.options.length > 1) {
            element.remove(1);
        };
        events.forEach
            (event => {
                element.add(new Option(text = event.title, value = event.extendedProps.id))
            })
    })
}


async function deleteBirthday() {
    const selectElement = document.getElementById('del_select');
    const events = calendar.getEvents()
    for (let i = 0; i < events.length; i++) {
        if (events[i].extendedProps.id == selectElement.value) {
            const response = await fetch(`http://127.0.0.1:8080/birthdays/${events[i].extendedProps.id}`,
                {
                    headers: {
                        'X-CSRF-TOKEN': _getCookie('csrf_access_token'),
                        "Content-Type": "text/plain", //application/json
                    },
                    method: "DELETE",
                    credentials: "include",
                })
            if (response.status === 204) {
                events[i].remove()
                fillSelect()
            }
            break;
        }
    };
}


function fillChangeForm() {
    const events = calendar.getEvents()
    for (let i = 0; i < events.length; i++) {
        if (events[i].extendedProps.id === document.getElementById('change_select').value) {
            document.getElementById('change_name').value = events[i].title
            document.getElementById('change_day').value = events[i].start.getDate()
            document.getElementById('change_month').value = events[i].start.getMonth()
            if (events[i].extendedProps.yearBirth != undefined) {
                document.getElementById('change_year').value = events[i].extendedProps.yearBirth
            }
            else { document.getElementById('change_year').value = undefined }
            if (events[i].extendedProps.note != (undefined || '')) {
                document.getElementById('change_note').value = events[i].extendedProps.note
            }
            else { document.getElementById('change_note').value = undefined }
            break;
        }
    }
}


function formViewToggle(formId) {
    // var allForms = document.querySelectorAll('[id*="form"]');
    const form = document.getElementById(formId);
    if (form.className === 'hidden') {
        form.classList.remove('hidden');
    } else {
        form.classList.add('hidden');
    }
}


renderCalendar();