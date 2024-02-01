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
    clearForm("add_form")
}


async function changeBirthday() {
    const change_event = calendar.getEventById(document.getElementById('change_select').value)
    console.log(change_event)
    const request_data = {
        "name": document.getElementById('change_name').value,
        "day": document.getElementById('change_day').value,
        "month": document.getElementById('change_month').value,
        "year": document.getElementById('change_year').value,
        "note": document.getElementById('change_note').value
    }
    if (request_data['year'] === (undefined || '')) {
        delete request_data['year']
    }
    if (request_data['note'] === (undefined || '')) {
        delete request_data['note']
    }
    const response = await fetch(`http://127.0.0.1:8080/birthdays/${change_event.id}`,
        {
            headers: {
                'X-CSRF-TOKEN': _getCookie('csrf_access_token'),
                "Content-Type": "application/json",
            },
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(request_data)
        })
    if (response.status === 200) {
        change_event.remove()
        _addEvent(response.json)
        fillSelect()
        clearForm("change_form")
    }
}


function _addEvent(data_obj) {
    const day = _minTwoDigits(data_obj['day'])
    const month = _minTwoDigits(data_obj['month'])
    const date = new Date();
    const yearCurrent = date.getFullYear();
    calendar.addEvent({
        id: data_obj['id'],
        title: data_obj['name'],
        start: `${yearCurrent}-${month}-${day}`,
        allDay: true,
        extendedProps: {
            note: data_obj['note'],
            yearBirth: data_obj['year']
        }
    });
}


async function fillSelect() {
    const selectElements = [document.getElementById('change_select'), document.getElementById('delete_select')];
    const events = calendar.getEvents()
    selectElements.forEach(element => {
        while (element.options.length > 1) {
            element.remove(1);
        };
        events.forEach
            (event => {
                element.add(new Option(text = event.title, value = event.id))
            })
    })
}


async function deleteBirthday() {
    const delete_event = calendar.getEventById(document.getElementById('delete_select').value)
    const response = await fetch(`http://127.0.0.1:8080/birthdays/${delete_event.id}`,
        {
            headers: {
                'X-CSRF-TOKEN': _getCookie('csrf_access_token'),
                "Content-Type": "text/plain", //application/json
            },
            method: "DELETE",
            credentials: "include",
        })
    if (response.status === 204) {
        delete_event.remove()
        fillSelect()
    }
}


function fillChangeForm() {
    const event = calendar.getEventById(document.getElementById('change_select').value);

    document.getElementById('change_name').value = event.title
    document.getElementById('change_day').value = event.start.getDate()
    document.getElementById('change_month').value = event.start.getMonth() + 1
    if (event.extendedProps.yearBirth != undefined) {
        document.getElementById('change_year').value = event.extendedProps.yearBirth
    }
    else { document.getElementById('change_year').value = undefined }
    if (event.extendedProps.note != (undefined || '')) {
        document.getElementById('change_note').value = event.extendedProps.note
    }
    else { document.getElementById('change_note').value = undefined }
}


function clearForm(formId) {
    const div = document.getElementById(formId)
    div.querySelectorAll("input").forEach(element => element.value = '')
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