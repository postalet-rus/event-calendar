"use strict";
const DAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
                "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const monthsSection = Array.from(document.querySelectorAll(".month-container"));
const calendarHead = document.querySelector("#_calHead");
const monthDisplay = document.querySelector("#_monthDisplay");
const selectingMenu = document.querySelector("#_selectMenu");
const _evContainer = document.querySelector("#_evContainer");
let monthData, tempCell;


function destroyTheChild(element) {
  while (element.firstElementChild) {
    element.firstElementChild.remove()
  }
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie) {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue
}

function makeMonthDataRequest() {
  let xhr = new XMLHttpRequest();
  let csrf_token = getCookie("csrftoken");
  xhr.open("POST", "events");
  xhr.setRequestHeader("X-CSRFToken", csrf_token);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  let first = toUTC(calSet.year, calSet.month, new Date(calSet.year, calSet.month, 1).getDate())
  let last = toUTC(calSet.year, calSet.month, new Date(calSet.year, calSet.month + 1, 0).getDate());
  let postData = JSON.stringify({
      "first": first,
      "last": last,
    });
  xhr.send(postData);
  xhr.onload = function() {
    // console.log(JSON.parse(xhr.response))
    if(xhr.response) {
      fillEventInCells(JSON.parse(xhr.response))
    }
  }
}

function toUTC(year, month, day) {
  let UTCMonth = month < 9 ? month = `0${month + 1}` : month = `${month + 1}`;
  let UTCDay = day < 10 ? day = `0${day}` : day = `${day}`;
  return `${year}-${UTCMonth}-${UTCDay}`;
}

function verboseDate(UTCDate) {
  let dateSplitted = UTCDate.split("-");
  return `${+dateSplitted[2]} ${MONTHS[+dateSplitted[1] - 1]}`
}

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let today = new Date().getDate();


const calSet = {
  year: currentYear,
  month: currentMonth,
  get selectedMonth() {
    return this.month;
  },
  set selectedMonth(value) {
    if(value > 11) {
      this.year++;
      this.month = 0;
    } else if (value < 0) {
      this.year--;
      this.month = 11;
    } else {
      this.month = value;
    }
    monthDisplay.innerHTML = MONTHS[this.month];
    makeMonthDataRequest();
    createCalendarBody();
  },
};

function createCalendarControls() {
  let buttons = document.querySelectorAll(".switchM-button");
   buttons.forEach((button, index) => {
     button.addEventListener("click", () => {
       switchMonth(index);
     });
   });
}

function switchMonth(index) {
  switch(true) {
    case index === 0:
      calSet.selectedMonth -= 1;
      break;
    case index === 1:
      calSet.selectedMonth += 1;
      break;
    default:
      console.error("switchMonth: Error has occured when trying switch month. Argument has unexpected value.")
  }
}

function createCalendarBody() {
  let monthTable = document.querySelector("#_monthTable");
  if (monthTable) {
    monthTable.remove();
  }
  let firstDay,
    firstWeekDay = new Date(calSet.year, calSet.month, 1).getDay();
  let lastMonthDay = new Date(calSet.year, calSet.month + 1, 0).getDate();
  let day = 1;
  let tableBody = document.createElement("tbody");
  tableBody.id = "_monthTable";
  calendarHead.insertAdjacentElement("beforeEnd", tableBody);
  firstWeekDay == 0 ? (firstWeekDay = 7) : firstWeekDay;
  while(day <= lastMonthDay) {
    let weekRow = document.createElement("tr");
    tableBody.insertAdjacentElement("beforeEnd", weekRow);
    for (let i = 1; i <= 7; i++) {
      
      let dayCell = document.createElement("TD");

      if (firstWeekDay === i) {
        firstDay = 1;
      }

      if (firstDay) {
        let span = document.createElement("span");
        let eventMap = document.createElement("div");
        eventMap.classList.add("event-map-container");
        eventMap.dataset.date = toUTC(calSet.year, calSet.month, day);
        span.innerHTML = `${day}`;
        dayCell.classList.add("cell-day");
        dayCell.setAttribute("title", `${verboseDate(toUTC(calSet.year, calSet.month, day))}`)
        dayCell.insertAdjacentElement("beforeEnd", span);
        dayCell.insertAdjacentElement("beforeEnd", eventMap);
        day++;
      }

      weekRow.insertAdjacentElement("beforeEnd", dayCell);
      if (day > lastMonthDay) {
        break;
      }
    }
  }
}

function tableActionsInit() {
  calendarHead.addEventListener("click", (event) => {
    if(event.target.tagName === "SPAN" && event.target !== tempCell){
      tempCell = event.target;
      let eventHolder = event.target.nextSibling;
      destroyTheChild(_evContainer);
      if(monthData) {
        monthData.forEach((item) => {
          if(item[4] == eventHolder.dataset.date) {
            _evContainer.insertAdjacentHTML("beforeEnd", 
            `<div class="event-card">
              <span class="event-title">Мероприятие: ${item[1]}</span>
              <span class="event-responsible">Ответственный: ${item[2]}</span>
              <span class="event-description">Описание: ${item[3]}</span>
            </div>`)
          }
        })
      }
    }
  })
}

function initMonthSelectionMenuOpen() {
  monthDisplay.addEventListener("click", () => {
    selectingMenu.removeAttribute("hidden");
  });
}

function MonthSelect(index) {
  calSet.selectedMonth = index;
  selectingMenu.setAttribute("hidden", "");
}

function initMonthSelect() {
  let monthsSelectionElements = document.querySelectorAll(".month-item");
  monthsSelectionElements.forEach((item, index) => {
    item.addEventListener("click", () => MonthSelect(index));
  });
}

function fillEventInCells(data) {
  if(data) {
    monthData = data;
    data.forEach((item) => {
      let eventcell = document.querySelector(`[data-date="${item[4]}"]`);
      eventcell.insertAdjacentHTML(
        "beforeEnd",
        `<img class="event-image" src="static/index/img/event.svg" %}">`
      );
    })
  }
}

function calendarInitialization() {
  monthDisplay.innerHTML = MONTHS[calSet.month];

  createCalendarControls();

  initMonthSelectionMenuOpen();
  
  initMonthSelect();

  createCalendarBody();

  tableActionsInit();

  makeMonthDataRequest();
}

calendarInitialization();
