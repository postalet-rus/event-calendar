"use strict";

const menuSections = document.querySelectorAll(".menu-section");
const sections = document.querySelectorAll(".section");
const months = document.querySelectorAll(".month-container");
const buttonToFullView = document.querySelector("#_btnFullV");
const controlsMenu = document.querySelector("#_controlsMenu");
let _menuExpanded = 1;
let current = 0;


function iterateMonthsContainers() {
  months.forEach((item, index) => {
    item.addEventListener("click", () => {
      maximizeMonthContainer(item);
    });
  });
}


function menuView() {
  menuSections.forEach(function(item, index){
    item.addEventListener("click", () => {
      slideSection(index);
    });
  });
}

function slideSection(index) {
  if(current === index) { return; }
  menuSections[index].classList.add("menu-section-current");
  menuSections[current].classList.remove("menu-section-current");
  for(let i = sections.length - 1; i > index; i--) {
    sections[i].style = `transform: translate(${(i + 1) * 100}%); opacity: 0`;
  }
  for(let i = 0; i < index; i++) {
    sections[i].style = `transform: translate(-${(i + 1) * 100}%); opacity: 0`;
  }
  sections[index].style = `transform: translate(-${index * 100}%); opacity: 1`;
  current = index;
}

function maximizeMonthContainer(element) {
  let monthToHide = Array.from(months);
  if(_menuExpanded !== 0) {
    let monthsFiltered = monthToHide.filter((item) => { return item !== element;} );
    monthsFiltered.forEach((item) => {
      item.setAttribute("hidden", "");
    });
    controlsMenu.removeAttribute("hidden");
    _menuExpanded = 0;
  } else {
    controlsMenu.setAttribute("hidden", "");
  }
}

function controlMenuSetup() {
  controlsMenu.addEventListener("click", () => {
    maximizeMonthContainer();
  });
}

menuView();
iterateMonthsContainers();