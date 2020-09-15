"use strict";

let today = new Date().getDate();
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль",
                "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

const calendarSettings = {
  monthIndex: currentMonth,
  fullYear: currentYear,
  get month() {
    return this.monthIndex;
  },

  get year() {
    return this.fullYear;
  },

  get monthName() {
    return MONTHS[currentMonth];
  },

  set month(value) {
    if(value < 0) {
      this.monthIndex = 11;
      this.fullYear--;
    } else if (value > 11){
      this.monthIndex = 0;
      this.fullYear++;
    } else {
      this.monthIndex = value;
    }
    drawCalendar();
  },

  set year(value) {
    this.fullYear = value;
    drawCalendar();
  }
};

const calendarPosition = document.querySelector("#calMain");
const leftBtn = document.querySelector("#leftBtn"), rightBtn = document.querySelector("#rightBtn");
const leftBtnYear = document.querySelector("#leftBtnYear"), rightBtnYear = document.querySelector("#rightBtnYear");
const yearTitle = document.querySelector("#yearTitle");
const monthDisplayTitle = document.querySelector("#monthTitle");
const yearDisplayTitle = document.querySelector("#yearTitle");
let drawingStatus;


// initial month value
monthDisplayTitle.innerHTML = `<span class="month-title">${MONTHS[calendarSettings.monthIndex]}</span>`;

function getFormattedFirstDay() {
  let firstDay = new Date(calendarSettings.year, calendarSettings.monthIndex).getDay();
  if (firstDay === 0) {
    firstDay = 7;
  }
  return firstDay;
}

function drawCalendar() {
  calendarPosition.innerHTML = '';
  monthDisplayTitle.innerHTML = `<span class="month-title">${MONTHS[calendarSettings.monthIndex]}</span>`;
  yearTitle.innerHTML = `${calendarSettings.year}`;
  let firstWeekDay, day = 1;
  let lastDay = new Date(calendarSettings.year, calendarSettings.monthIndex + 1, 0).getDate();
  // draw calendar
  drawingStatus = setInterval(() => {
    let cell = document.createElement("TD");
    if (!firstWeekDay) {
      firstWeekDay = cell.style = `grid-column-start: ${getFormattedFirstDay()}`;
    }
    calendarPosition.insertAdjacentElement("beforeEnd", cell);
    cell.innerHTML = `${day}`;
    if (compareDateByDay(day)) {
      cell.classList.add("today");
    }
    day++;
    if (day > lastDay) {
      clearInterval(drawingStatus);
      setTimeout(drawingStatus = "", 5);
    }
  }, 5);
}

function compareDateByDay(day) {
  return calendarSettings.year === currentYear && calendarSettings.monthIndex === currentMonth && today === day;
}

function slideMonth() {
  if(leftBtn && rightBtn) {
    // event listener for left button
    leftBtn.addEventListener("click", () => {
      if(drawingStatus) { return; }
        calendarSettings.month -= 1;
    });
    // event listener for right button
    rightBtn.addEventListener("click", () => {
      if (drawingStatus) { return; }
        calendarSettings.month += 1;
    });
  }
}

function slideYear() {
  if(leftBtnYear && rightBtnYear) {
    leftBtnYear.addEventListener("click", () => {
      if(drawingStatus) { return; }
      calendarSettings.year--;
    });
    rightBtnYear.addEventListener("click", () => {
      if(drawingStatus) { return; }
      calendarSettings.year++;
    });
  }
}

function showMonthChangeMenu() {
  let changeMenuBlock = document.createElement("div");
  changeMenuBlock.classList.add("month-menu");
  let monthWrp = document.querySelector("#monthWrp");
  monthDisplayTitle.addEventListener("click", (event) => {
    if (changeMenuBlock.contains(event.target) || drawingStatus || document.querySelector(".month-menu")) { return; }
    monthWrp.insertAdjacentElement("beforeEnd", changeMenuBlock);
    for(let i = 0; i <= 11; i++) {
      let monthCell = document.createElement("div");
      monthCell.classList.add("month-item");
      if(calendarSettings.month === i) {
        monthCell.classList.add("current-month");
      }
      monthCell.innerHTML = MONTHS[i];
      changeMenuBlock.insertAdjacentElement("beforeEnd", monthCell);
    }
    selectMonth(changeMenuBlock);
  });
}

function selectMonth(menu) {
  let monthsArr = Array.from(document.querySelectorAll(".month-item"));
  monthsArr.forEach((item,index) => {
    item.addEventListener("click", (event) => {
      menu.innerHTML = "";
      if(!drawingStatus) {
        calendarSettings.month = index;
        menu.remove();
      }
    });
  });
}

showMonthChangeMenu();
slideMonth();
slideYear();

// При нажатии на кнопки навигации, объект monthObj меняет месяц и, в соответствии с новым месяцем,
//  должна вызываться функция
/*
  1)  Крутим дизайн до состояния азерчай (шобы на йс вода была) x
  2)  Сделать слайд в сторону, зависимую от переменной (если текущая секция > var, тогда влево и тд)
  3)  Доработать фон до состояния чая Липтон(чтобы был и отображался на микрокомпутерах нормально)
  5)  Переработать скрытие элементов (добавить возможность анимировать смену атрибута hidden)
  8)  Добавить контейнер для событий, нашпиговать болванками + трайнуть смену vidа (сет очка, спис очек)
  9)  Начать клипать меню событий (фор админ + html/css/js перенести в отдельный файл после попытки)
  10)
*/ 

/* 
    органайзер (добавлять шняхи от юзернейма на день)
*/