import streamlit as st
from streamlit_calendar import calendar
import requests
import datetime

st.title("Your birthdays")

calendar_options = {
    "firstDay": "1",  # Monday
    "headerToolbar": {"center": "title", "right": "today prev,next", "left": ""},
    "initialView": "dayGridMonth",
    # "slotMinTime": "06:00:00",
    # "slotMaxTime": "18:00:00",
    # "resourceGroupField": "building",
    # "resources": [
    #     {"id": "a", "building": "Building A", "title": "Building A"},
    #     {"id": "b", "building": "Building A", "title": "Building B"},
    #     {"id": "c", "building": "Building B", "title": "Building C"},
    #     {"id": "d", "building": "Building B", "title": "Building D"},
    #     {"id": "e", "building": "Building C", "title": "Building E"},
    #     {"id": "f", "building": "Building C", "title": "Building F"},
    # ],
}

# calendar_events = [
#     {
#         "title": "Oleh",
#         "allDay": "true",
#         "start": "2023-10-04T00:00:00",
#         "resourceId": "a",
#         "description": "Lecture",
#     },
#     {
#         "title": "Nazar",
#         "allDay": "true",
#         "start": "2023-11-04T00:00:00",
#         "resourceId": "b",
#     },
#     {
#         "title": "Natali Samoylenko",
#         "allDay": "true",
#         "start": "2023-10-14T00:00:00",
#         "resourceId": "a",
#     },
# ]


# @st.cache_data
def calendar_data():
    calendar_events = []
    data = requests.get("http://127.0.0.1:80/birthdays", params={"id": 1234}).json()

    for datacell in data:
        birthday = {
            "title": datacell["name"],
            "start": datetime.datetime(
                datetime.date.today().year, datacell["month"], datacell["day"], 0, 0, 0
            ).isoformat(),
            "allDay": "true",
        }
        calendar_events.append(birthday)
    return calendar_events


custom_css = """
    .fc-event-past {
        opacity: 0.8;
    }
    .fc-event-time {
        font-style: italic;
    }
    .fc-event-title {
        font-weight: 700;
    }
    .fc-toolbar-title {
        font-size: 2rem;
    }
"""

calendar = calendar(
    events=calendar_data(), options=calendar_options, custom_css=custom_css
)
st.write(calendar)
