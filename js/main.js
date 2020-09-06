"use strict"

// utility functions and shortcuts
const $ = (selector) => { return document.querySelector(selector) } // get element by X selector
const $all = (selector) => { return document.querySelectorAll(selector) } // get all elements by X selector
const $arr = (elementName) => {
  if($(elementName) !== undefined) {
    return Array.from($all(elementName))
  }
}
const $new = (elementName, elementClass) => { // create X element
  let newElement = document.createElement(elementName);
  if (elementClass) {
    newElement.className = `${elementClass}`
  }
  return newElement
}
const $posCenterX = (element) => { // returns x coordinates of elements center
  let posX = element.getBoundingClientRect().x;
  let width = element.getBoundingClientRect().width;
  return posX + (width / 2)
}
const $posCenterY = (element) => { // returns y coordinates of elements center
  let posY = element.getBoundingClientRect().y;
  let height = element.getBoundingClientRect().height;
  return posY + (height / 2)
}
const DAYENTRY = (date, element, weekday) => {return {"date": date, "element": element, "weekday": weekday}}; // create day object
const WEEKDAY = (day) => { // get weekday by day shortcut
  let weekday = new Date(YEAR, month, day).getDay();
  weekday === 0 ? weekday = 7 : weekday;
  return weekday
}
const UTC = (yyyy, mm, dd) => { // parse date to UTC format YYYY-MM-DD
  mm < 10 ? mm = `0${mm+1}` : mm+1;
  dd < 10 ? dd = `0${dd}` : dd;
  return `${yyyy}-${mm}-${dd}`
}
const TODAY = () => { // get today in UTC
  let day = new Date().getDate();
  let mm = new Date().getMonth();
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
  calendarPlace.insertAdjacentElement("beforeEnd", constructAndGetMenuBlock())
  return table
}


function highlightToday(month) {
  let today = days.filter(item => item.date == TODAY())[0];
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
 
function toggleDayEventsMenu() { //shows menu
  let menu = $(".event-menu");
  if(menu.classList.contains("hidden")) {
    showMenu()
  } else {
    $(".toggle-container").classList.add("toggle-container-minimized");
    $(".event-menu").classList.add("minimized")
  }
  return menu
}

function bindEventListenerToElements(table) { // adding events
  let body = $("body");
  let exceptionBlocks = [$("#s_expand_m"), $arr(".expanded-block"), $(".event-menu")]

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
    toggleDayEventsMenu();
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

function constructAndGetMenuBlock() { // create menu div block
  // creating elements
  let menu = $new("div", "event-menu hidden");
  let menuWrapper = $new("div", "event-menu-wrapper");
  let toggleContainer = $new("div", "toggle-container");
  let hr = $new("hr");
  let menuTitle = $new("h3", "menu-title");
  menuTitle.innerHTML = "События";
  let eventsContainer = $new("div", "events-container");
  eventsContainer.id = "events_container";

  // build menu
  menu.insertAdjacentElement("beforeEnd", menuWrapper);
  menuWrapper.insertAdjacentElement("afterBegin", toggleContainer);
  menuWrapper.insertAdjacentElement("beforeEnd", menuTitle);
  menuWrapper.insertAdjacentElement("beforeEnd", hr);
  menuWrapper.insertAdjacentElement("beforeEnd", eventsContainer);

  menu.addEventListener("click", (event) => {
    if (toggleContainer.contains(event.target)) {
      menu.classList.toggle("minimized");
      toggleContainer.classList.toggle("toggle-container-minimized");
    }
  });
  return menu
}

function hardClean() { // cleans events menu without animation
  let menu = $(".event-menu");
  if (menu) menu.classList.add("hidden");
  currentTD = undefined;
}

function showMenu() {
  let menu = $(".event-menu");
  if(menu.classList.contains("hidden")) menu.classList.remove("hidden");
  menu.classList.add("menu-expanded");
}

function hideMenu() { // hides events menu
  let menu = $(".event-menu");
  if (menu.classList.contains("menu-expanded")) {
    menu.classList.remove("menu-expanded");
    menu.classList.add("hidden");
  }
}


// selection
let selected = [];
function startSelection() {
  let xcoord, ycoord, finalX, finalY;
  let table = $(".calendar-body");
  table.addEventListener("mousedown", (event) => {
    if ($(".event-menu").contains(event.target)) return
    if (selected.length > 0) {
      selected.forEach(item => {
        item.element.classList.remove("selected-cell");
      });
      selected = []
    }
    xcoord = event.clientX;
    ycoord = event.clientY;
  })
  table.addEventListener("mousemove", (event) => {
  })
  table.addEventListener("mouseup", (event) => {
    if ($(".event-menu").contains(event.target)) return
    finalX = event.clientX;
    finalY = event.clientY;
    finalX < xcoord ? finalX = [xcoord, xcoord = finalX][0] : finalX;
    finalY < ycoord ? finalY = [ycoord, ycoord = finalY][0] : finalY;
    for(let item of days) {
      if (finalX >= $posCenterX(item.element) &&
          $posCenterX(item.element) >= xcoord && 
          finalY >= $posCenterY(item.element) &&
          $posCenterY(item.element) >= ycoord) {
        item.element.classList.add("selected-cell");
        selected.push(item)
      }
     }
  })
  table.addEventListener("dragstart", (event) => event.preventDefault())
}

function bindEventListenersToSettings() {
  let settingsBox = $("#settings");
  let settingsList = $all(".settings-block");
  if (settingsList.length == 0) {console.log("Settings blocks don't exists"); return false};
  let settingsArray = Array.from(settingsList);
  settingsBox.addEventListener("mouseout", (event) => {
    if(settingsBox.contains(event.relatedTarget)) return
    $("#s_expand_m").classList.add("hidden");        
  })
  settingsList.forEach(item => {
    item.addEventListener("click", () => expandMenu(item));
  })
}

function expandMenu(item) {
  let settingsMenu = $("#s_expand_m"); 
  let expandedBlocks = $arr(".expanded-block");
  if (settingsMenu.classList.contains("hidden")) settingsMenu.classList.remove("hidden");
  switch(true) {
    case item.id === "s_date":
      expandedBlocks.forEach(arrItem => {
        if (arrItem.id === "es_date") {
          arrItem.classList.remove("hidden");
        } else if (!arrItem.classList.contains("hidden")) {
          arrItem.classList.add("hidden")
        }
      })
      break
    case item.id === "s_range":
      expandedBlocks.forEach(arrItem => {
        if (arrItem.id === "es_range") {
          arrItem.classList.remove("hidden");
        } else if (!arrItem.classList.contains("hidden")) {
          arrItem.classList.add("hidden")
        }
      })
      break
    case item.id === "s_utility":
      expandedBlocks.forEach(arrItem => {
        if (arrItem.id === "es_utility") {
          arrItem.classList.remove("hidden");
        } else if (!arrItem.classList.contains("hidden")) {
          arrItem.classList.add("hidden")
        }
      })
      break
    case item.id === "s_notes":
      expandedBlocks.forEach(arrItem => {
        if (arrItem.id === "es_notes") {
          arrItem.classList.remove("hidden");
        } else if (!arrItem.classList.contains("hidden")) {
          arrItem.classList.add("hidden")
        }
      })
      break
  }
}

function changeTheme(element) {
  let body = $('body');
  body.classList.toggle("black-themed")
}

//initialization//
let generatedCalendar = calendarPlace.insertAdjacentElement("afterbegin", fillCalendar(month));
bindEventListenerToElements(generatedCalendar);
highlightToday(month);
bindEventListenersToSettings()
startSelection()