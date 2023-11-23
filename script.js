
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


// async function apiAuth(user) {
//     return new Promise(function (resolve, reject) {
//         fetch_args = {}
//         for (const [key, val] of Object.entries(user)) {
//             fetch_args[key] = val;
//         }
//         if (fetch('http://127.0.0.1:8080/login?' + new URLSearchParams(fetch_args))) {
//             resolve();
//         }
//         reject();
//     });
// }
async function apiAuth(user) {
    fetch_args = {}
    for (const [key, val] of Object.entries(user)) {
        fetch_args[key] = val;
    };
    await fetch('http://127.0.0.1:8080/login?' + new URLSearchParams(fetch_args),
        { credentials: 'omit' }
    );
    console.log("logged in")
    var theCookies = document.cookie.split(';');
    var aString = '';
    for (var i = 0; i <= theCookies.length; i++) {
        aString += i + ' ' + theCookies[i - 1] + "\n";
    }
    console.log(aString)
    return true
}


function getCookie(name) {
    console.log('lol')
    console.log(document.cookie);
    const value = `; ${document.cookie}`;
    console.log(value)
    const parts = value.split(`; ${name}=`);
    console.log(parts)
    console.log(parts.length)
    if (parts.length === 2) {
        console.log(name)
        return parts.pop().split(';').shift();
    }
}

// function getCookie(name) {
//     function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
//     var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
//     return match ? match[1] : null;
// }


async function getInitData() {
    console.log('start get data')
    console.log(getCookie('csrf_access_token'));
    setTimeout(function () {
        console.log(getCookie('csrf_access_token'));
    }, 2000);
    const response = await fetch('http://127.0.0.1:8080/birthdays',
        {
            headers: { 'X-CSRF-TOKEN': getCookie('csrf_access_token') },
            method: "GET",
            credentials: "omit"
        });
    console.log('made request')
    const data = await response.json();
    console.log('went through awaits')
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
    // alert('Logged in as ' + user.first_name);
}

renderCalendar();