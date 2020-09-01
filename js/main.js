"use strict"


// utilities 
const $ = (x) => { return document.querySelector(x) } //get element by X selector
const $all = (x) => { return document.querySelectorAll(x) } //get all elements by X selector
const $new = (x) => { return document.createElement(x) } //create X element
const month = new Date().getMonth()

const $UTC = (yyyy, mm, dd) => { //parse date to UTC format YYYY-MM-DD
  mm < 10 ? mm = `0${mm+1}` : mm+1;
  dd < 10 ? dd = `0${dd}` : dd;
  return `${yyyy}-${mm}-${dd}`
}

const TODAY = (mm) => {
  let day = new Date().getDate();
  mm < 10 ? mm = `0${mm + 1}` : mm + 1;
  day < 10 ? day = `0${day}` : day;
  return `${YEAR}-${mm}-${day}`
}


let calendarPlace = $("#cal_main");
const YEAR = new Date().getFullYear();
const WEEKDAYS = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const WEEKDAYS_SHORTCUTS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];


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


function createCalendarBody(month) {
  let firstCalendarDay; //false
  let day = 2;
  let table = createCalendarHeader();
  let firstWeekDay = new Date(YEAR, month, 1).getDay();
  let lastDay = new Date(YEAR, month + 1, 0).getDate();
  firstWeekDay == 0 ? firstWeekDay = 7 : firstWeekDay = firstWeekDay; //sets sunday value to 7 instead of 0 
  while(1) {
    let tableRow = table.insertAdjacentElement("beforeEnd", $new("tr"));
    for(let i = 1; i<=7; i++) {
      if (!firstCalendarDay) {
        let cellContent = getFirstCalendarDay(firstWeekDay, i);
        if(cellContent.innerHTML != "") {
          firstCalendarDay = tableRow.insertAdjacentElement("beforeEnd", getFirstCalendarDay(firstWeekDay, i));
          firstCalendarDay.dataset.data = $UTC(YEAR, month, 1);
        } else {
          let tableCell = tableRow.insertAdjacentElement("beforeEnd", cellContent);
        } continue
      }
      let tableCell = tableRow.insertAdjacentElement("beforeEnd", $new("td"));
      tableCell.innerHTML = `${day}`;
      tableCell.dataset.data = $UTC(YEAR, month, day);
      day++;
      if(day > lastDay) {
        bindEventListenerToElements(table);
        return table
      }
    }
  }
}

function highlightToday(month) {
  let todayTD = $("[data-data='"+TODAY(month)+"']");
  if(todayTD) todayTD.classList.add("today")
}


function getFirstCalendarDay(firstWeekDay, i) {
  let calendarDay;
  if(firstWeekDay === i) {
    calendarDay = $new("td");
    calendarDay.innerHTML = `${1}`;
  } else {
    calendarDay = $new("td");
  } return calendarDay
}


function highlight(event) {
  if (event.target.tagName !== "TD" || event.target.innerHTML == "") return;
  let curTD = event.target;
  curTD.style = "background: #e06e45; color: #F0F0F0";
  highlightTH(curTD);
}

function clearHighlight(event) {
  if (event.target.tagName !== "TD") return;
  let highlightedTD = event.target;
  highlightedTD.removeAttribute("style");
  clearHighlightTH(highlightedTD.cellIndex)
}

function highlightTH(cell) {
  let cellIndex = cell.cellIndex;
  let thIndex = $('table').rows[0].cells[cellIndex];
  thIndex.style = "background: linear-gradient(180deg, rgba(245,51,51,1) 0%, rgba(245,70,51,1) 30%, rgba(224,110,69,1) 85%); color: #EFDDDB";
}

function clearHighlightTH(cell) {
  let highlightedTH = $('table').rows[0].cells[cell];
  highlightedTH.removeAttribute("style")
}


function bindEventListenerToElements(table) {
  // mouseover - highlight TD;
  table.addEventListener("mouseover", (event) => {
    highlight(event)
  });

  // mouseout - clearHighlight;
  table.addEventListener("mouseout", (event) => {
    clearHighlight(event)
  });

  // 
  table.addEventListener("click", (event) => {
  });
}


function slideSection(element) {
  let currentSection = $(`.${element.name}`);
  let menuItems = Array.from($all("section"));
  if (currentSection.classList.contains("active")) {
    return
  } else {
    menuItems.splice(menuItems.indexOf(currentSection), menuItems.indexOf(currentSection)); //delete current element from array
    menuItems.forEach((item) => {
      item.classList.remove("active");
      item.classList.add("hidden");
    });
    currentSection.classList.remove("hidden");
    currentSection.classList.add("active")
  }
} 


calendarPlace.insertAdjacentElement("afterbegin", createCalendarBody(month));
highlightToday(month);