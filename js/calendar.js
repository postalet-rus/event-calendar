"use strict";
const DAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
                "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const monthsSection = Array.from(document.querySelectorAll(".month-container"));
const calendarHead = document.querySelector("#_calHead");
const monthDisplay = document.querySelector("#_monthDisplay");
const selectingMenu = document.querySelector("#_selectMenu");

function toUTC(year, month, day) {
  let UTCMonth = month < 10 ? month = `0${month + 1}` : month = `${month + 1}`;
  let UTCDay = day < 10 ? day = `0${day}` : day = `${day}`;
  return `${year}-${UTCMonth}-${UTCDay}`;
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
    console.log(this.month);
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
  while(day < lastMonthDay) {
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

function calendarInitialization() {
  monthDisplay.innerHTML = MONTHS[calSet.month];

  createCalendarControls();

  initMonthSelectionMenuOpen();
  
  initMonthSelect();

  createCalendarBody();

}

calendarInitialization();
