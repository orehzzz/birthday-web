import streamlit as st
import streamlit.components.v1 as components
from streamlit_calendar import calendar
import requests
import datetime


# st.title("Your birthdays")

# calendar_options = {
#     "firstDay": "1",  # Monday
#     "headerToolbar": {"center": "title", "right": "today prev,next", "left": ""},
#     "initialView": "dayGridMonth",
# }


# @st.cache_data
# def calendar_data():
#     calendar_events = []
#     data = requests.get("http://127.0.0.1:8080/birthdays", params={"id": 1234}).json()

#     for datacell in data:
#         birthday = {
#             "title": datacell["name"],
#             "start": datetime.datetime(
#                 datetime.date.today().year, datacell["month"], datacell["day"], 0, 0, 0
#             ).isoformat(),
#             "allDay": "true",
#         }
#         calendar_events.append(birthday)
#     return calendar_events


# custom_css = """
#     .fc-event-past {
#         opacity: 0.8;
#     }
#     .fc-event-time {
#         font-style: italic;
#     }
#     .fc-event-title {
#         font-weight: 700;
#     }
#     .fc-toolbar-title {
#         font-size: 2rem;
#     }
# """

# calendar = calendar(
#     events=calendar_data(), options=calendar_options, custom_css=custom_css
# )
# st.write(calendar)
components.html(
    """
    <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="remember_about_birthdays_bot" data-size="large" data-auth-url="http://127.0.0.1:80/webpage" data-request-access="write"></script>
"""
)
