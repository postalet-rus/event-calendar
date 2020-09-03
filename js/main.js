"use strict"

// utility functions and shortcuts
const $ = (x) => { return document.querySelector(x) } //get element by X selector
const $all = (x) => { return document.querySelectorAll(x) } //get all elements by X selector
const $new = (elementName, elementClass) => {
  let newElement = document.createElement(elementName);
  if (elementClass) {
    newElement.className = `${elementClass}`
  }
  return newElement
} //create X element
const DAYENTRY = (date, element, weekday) => {return {"date": date, "element": element, "weekday": weekday}}; //create day object
const WEEKDAY = (day) => { //get weekday by day shortcut
  let weekday = new Date(YEAR, month, day).getDay();
  weekday === 0 ? weekday = 7 : weekday;
  return weekday
}
const UTC = (yyyy, mm, dd) => { //parse date to UTC format YYYY-MM-DD
  mm < 10 ? mm = `0${mm+1}` : mm+1;
  dd < 10 ? dd = `0${dd}` : dd;
  return `${yyyy}-${mm}-${dd}`
}
const TODAY = (mm) => { //get today in UTC
  let day = new Date().getDate();
  return UTC(YEAR, mm, day);
}

// elements and constant values
const WEEKDAYS_SHORTCUTS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const CALENDAR = $("#cal_main");
const month = new Date().getMonth();
const YEAR = new Date().getFullYear();
let calendarPlace = $("#cal_main");
let days = new Array;
let currentTD;

//functions
function createCalendarHeader() {
  let tableBody = $new("table");
  let tableHeaderRow = tableBody.insertAdjacentElement("afterBegin", $new("tr"));
  WEEKDAYS_SHORTCUTS.forEach((item) => {
    let tableCell = $new("th");
    tableCell.innerHTML = `${item}`;
    tableHeaderRow.insertAdjacentElement("beforeEnd", tableCell);
  })
  return tableBody
}

function fillCalendar(month) { //creates calendar body and inserts in table
  let firstday;
  let table = createCalendarHeader();
  let row = table.insertAdjacentElement("beforeEnd", $new("TR"));
  let firstWeekDay = new Date(YEAR, month, 1).getDay();
  firstWeekDay === 0 ? firstWeekDay = 7 : firstWeekDay;
  let lastDay = new Date(YEAR, month + 1, 0).getDate();
  for (let day = 1; day <= lastDay; day++) {
    let cell = $new("TD");
    if(!firstday) firstday = cell.style = `grid-column-start: ${firstWeekDay}`;
    cell.innerHTML = `${day}`;
    row.insertAdjacentElement("beforeEnd", cell);
    days.push(DAYENTRY(UTC(YEAR, month, day), cell, WEEKDAYS_SHORTCUTS[WEEKDAY(day)-1]))
  }
  return table
}

function highlightToday(month) {
  let today = days.filter(item => item.date == TODAY(month))[0];
  today.element.classList.add("today");
}

function highlightTH(cell) {
  if(cell.tagName === "TD") {
    let weekdayName = days.filter(item => item.element == cell)[0].weekday;
    let tableHeadElement = Array.from($all("th")).filter(item => item.innerHTML == weekdayName)[0];
    tableHeadElement.classList.add("active");
  }
}

function clearHighlightTH() {
  let highlightedTH = $("th.active");
  if(!highlightedTH) return
  highlightedTH.classList.remove("active")
}
 
function showDayEventsMenu() { //shows menu
  let menu = $(".event-menu");
  if(!menu) {
    menu = $("#cal_main").insertAdjacentElement("afterBegin", constructMenuBlock());
  } else {
    clear();
    menu = $("#cal_main").insertAdjacentElement("afterBegin", constructMenuBlock());
  } return menu
}

function bindEventListenerToElements(table) { // adding events

  // clearAll
  document.addEventListener("click", (event) => {
    if(event.target.tagName != "TD") {
      currentTD = null;
      clear()
    } 
  });

  // mouseover
  table.addEventListener("mouseover", (event) => {
    if (event.target.tagName !== "TD") return
    highlightTH(event.target);
  });

  // mouseout
  table.addEventListener("mouseout", (event) => {
    clearHighlightTH()
  });

  // click
  table.addEventListener("click", (event) => {
    if (event.target.tagName !== "TD" || currentTD == event.target) {
      return
    }
    currentTD = event.target;
    let eventMenu = showDayEventsMenu();
    setTimeout(() => eventMenu.classList.add("menu-expanded"), 1);
  });
}

function slideSection(element) { // shows clicked section and hides another ones
  let currentSection = $(`.${element.name}`);
  let menuItems = Array.from($all("section"));
  if (currentSection.classList.contains("active")) {
    return
  } else {
    hardClean()
    menuItems.splice(menuItems.indexOf(currentSection), menuItems.indexOf(currentSection)); // delete current element from array
    menuItems.forEach((item) => {
      item.classList.remove("active");
      item.classList.add("hidden");
    });
    currentSection.classList.remove("hidden");
    currentSection.classList.add("active")
  }
} 


window.addEventListener("keydown", (event) => { // shortcut
  if(event.code == "KeyR") {
    document.location.reload()
  }
})

function constructMenuBlock() { // create menu div block
  let menu = $new("div", "event-menu");
  let menuWrapper = $new("div", "event-menu-wrapper");
  let hr = $new("hr");
  let menuTitle = $new("h3", "menu-title");
  menuTitle.innerHTML = "События";
  let eventsContainer = $new("div", "events-container");
  eventsContainer.id = "events_container";

  menu.insertAdjacentElement("beforeEnd", menuWrapper);
  menuWrapper.insertAdjacentElement("beforeEnd", menuTitle);
  menuWrapper.insertAdjacentElement("beforeEnd", hr);
  menuWrapper.insertAdjacentElement("beforeEnd", eventsContainer);

  menu.addEventListener("click", () => {
    clear();
    currentTD = null;
  });
  return menu
}

function hardClean() { // cleans events menu without animation
  let menu = $(".event-menu");
  if (menu) menu.remove()
}

function clear() { // cleans events menu
  let menu = $(".event-menu");
  if (menu) {
    menu.classList.remove("menu-expanded");
    menu.addEventListener("transitionend", () => menu.remove());
  }
}

//initialization//
let generatedCalendar = calendarPlace.insertAdjacentElement("afterbegin", fillCalendar(month));
bindEventListenerToElements(generatedCalendar);
highlightToday(month);