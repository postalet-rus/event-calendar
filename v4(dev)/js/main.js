"use strict";

const $ = (x) => { return document.querySelector(x); }; // get element by query selector
const $all = (x) => { return document.querySelectorAll(x); }; // get all elements by query selector
let menuSections = '';
const table = $("#calMain");
 
// MENU LOADING & SLIDING
function finishedloading() {
  if ($(".container")) {
    setTimeout(() => {
      $(".loading-container").hidden = true;
      $(".container").hidden = 0;
    }, 100);
  }
}

function expandMenu() {
  let menu = $("#navMenu");
  let navItems = $(".nav-menu-full");
  if (menu) {
    menu.addEventListener("click", () => {
      menu.classList.toggle("menu-button-expanded");
      navItems.classList.toggle("nav-expanded");
    });
  }
}

function addClearClick() { // hides menu whenever user clicks out of menu on mobile version
  let menu = $("#navMenu");
  let navItems = $("#navItems");
  let body = $("body");
  if(navItems && body) {
    body.addEventListener("click", event => {
      if ($(".month-menu")) {
        if (!$("#monthWrp").contains(event.target)) {
          let menu = $(".month-menu");
          menu.innerHTML = '';
          menu.remove();
        }
      }
      if(!$(".nav-menu").contains(event.target)) {
        if(navItems.classList.contains("nav-expanded")) {
          navItems.classList.remove("nav-expanded");
          menu.classList.remove("menu-button-expanded");
        }
      }
    });
  }
}

function slideSection() {
  menuSections = Array.from($all(".nav-menu-item-full"));
  menuSections.forEach((item) => {
    item.addEventListener("click", () => showSection(item));
  });
}


/* showing sections */ 
let tempSection = ''; // opened section
let lastPressedSection = '';
function showSection(section) {
  let currentSection = $(`.${section.id}`); // clicked section
  if(!lastPressedSection) { lastPressedSection = section; }
  let sectionsArr = Array.from($(".nav-menu-item-full"));
  if(tempSection) {
    if(!isEqual(tempSection, currentSection)) {
      tempSection.setAttribute("hidden", "");
      tempSection = currentSection;
    } else {
      return;
    }
  }
  if(currentSection) {
    $(".page-status").setAttribute("hidden", "");
    currentSection.removeAttribute("hidden");
    tempSection = currentSection;
  }
  if(currentSection === $(".calendar") && !$("TD")) {
    drawCalendar();
  }
}

function isEqual(temp, check) {
  if(typeof(temp) === "object" && typeof(temp) === "object") {
    if(temp === check) {
      return 1;
    } else {
      return 0;
    }
  } else {
    console.error("positioning attributes must be elements(objects)");
  }
}

finishedloading();
expandMenu();
slideSection();
window.onload = addClearClick();

// notification выползает када евент близка

// Окно ошибок при ошибках в скрипте 
