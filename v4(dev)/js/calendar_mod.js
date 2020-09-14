"use strict";

let today = new Date().getDate();
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль",
                "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const calendarSettings = {
  monthIndex: currentMonth,
  year: currentYear,
  monthName: MONTHS[currentMonth],
};
const calendarPosition = document.querySelector("#calMain");
const leftBtn = document.querySelector("#leftBtn"), rightBtn = document.querySelector("#rightBtn");
const yearTitle = document.querySelector("#yearTitle");
const monthDisplayTitle = document.querySelector("#monthTitle");
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
let counter = 0;
function drawCalendar() {
  calendarPosition.innerHTML = '';
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
      drawingStatus = '';
    }
    counter += 5;
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
      if (calendarSettings.monthIndex === 0) {
        calendarSettings.year--;
        calendarSettings.monthIndex = 11;
      } else {
        calendarSettings.monthIndex--;
      }
      monthDisplayTitle.innerHTML = `<span class="month-title">${MONTHS[calendarSettings.monthIndex]}</span>`;
      yearTitle.innerHTML = `${calendarSettings.year}`;
      drawCalendar();
    });

    rightBtn.addEventListener("click", () => {
      if (drawingStatus) { return; }
      if (calendarSettings.monthIndex === 11) {
        calendarSettings.year++;
        calendarSettings.monthIndex = 0;
      } else {
        calendarSettings.monthIndex++;
      }
      monthDisplayTitle.innerHTML = `<span class="month-title">${MONTHS[calendarSettings.monthIndex]}</span>`;
      yearTitle.innerHTML = `${calendarSettings.year}`;
      drawCalendar();
    });
  }
}

slideMonth();

// При нажатии на кнопки навигации, объект monthObj меняет месяц и, в соответствии с новым месяцем,
//  должна вызываться функция
/*
  1)  Крутим дизайн до состояния азерчай (шобы на йс вода была)
  2)  Сделать слайд в сторону, зависимую от переменной (если текущая секция > var, тогда влево и тд)
  3)  Доработать фон до состояния чая Липтон(чтобы был и отображался на микрокомпутерах нормально)
  4)  Сделать listener на объект (при изменении -> перерисовывать календарь и апдейтать данные)
  5)  Переработать скрытие элементов (добавить возможность анимировать смену атрибута hidden)
  6)  Сменить кнопочки для навигации по календарю
  7)  Добавить меню выбора даты и месяца при нажатии и додумать смысл 3й кнопки
  8)  Добавить контейнер для событий, нашпиговать болванками + трайнуть смену vidа (сет очка, спис очек)
  9)  Начать клипать меню событий (фор админ + html/css/js перенести в отдельный файл после попытки)
  10)
*/ 

/* 
    органайзер (добавлять шняхи от юзернейма на день)
*/