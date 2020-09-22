"use strict";

const DAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
                "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const monthsSection = Array.from(document.querySelectorAll(".month-container"));
const calendarPlaceholder = document.querySelector("#_calMain");

function toUTC(year, month, day) {
  let UTCMonth = month < 10 ? month = `0${month + 1}` : month = `${month + 1}`;
  let UTCDay = day < 10 ? day = `0${day}` : day = `${day}`;
  return `${year}-${UTCMonth}-${UTCDay}`;
}

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let today = new Date().getDate();
let rendering = 0;


const calSet = {
  year: currentYear,
  month: currentMonth,
};

function createCalendarHeader() {
  let table = document.createElement("table");
  table.id = "_calHead";
  let calendarHead = document.createElement("thead");
  let weekDaysStr = document.createElement("tr");
  calendarHead.insertAdjacentElement("beforeend", weekDaysStr);
  table.append(calendarHead);
  for(let i = 0; i <= 6; i++) {
    let headerCell = document.createElement("th");
    headerCell.innerHTML = DAYS[i];
    weekDaysStr.append(headerCell);
  }
  return table;
}

function createCalendarBody(table) {
  if(rendering === 0) {  
    let firstDay, firstWeekDay = new Date(calSet.year, calSet.month, 1).getDay();
    let lastMonthDay = new Date(calSet.year, calSet.month + 1, 0).getDate();
    let day = 1;
    let tableBody = document.createElement("tbody");
    table.insertAdjacentElement("beforeEnd", tableBody);
    firstWeekDay == 0 ? firstWeekDay = 7 : firstWeekDay;
    let render = setInterval(() => {
      let weekRow = document.createElement("tr"); 
      tableBody.insertAdjacentElement("beforeEnd", weekRow);
      for(let i = 1; i <= 7; i++) {
        let dayCell = document.createElement("TD");
        if (firstWeekDay === i) { firstDay = 1; }
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
          if(day > lastMonthDay) {
            clearInterval(render);
            rendering = 0; 
            break; 
          }
        }
    }, 100);
  }
}


function calendarInitialization() {
  calendarPlaceholder.append(createCalendarHeader());
  createCalendarBody(document.querySelector("#_calHead"));
}

calendarInitialization();
