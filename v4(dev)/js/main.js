"use strict";

const $ = (x) => { return document.querySelector(x); }; // get element by query selector
const $all = (x) => { return document.querySelectorAll(x); }; // get all elements by query selector
const $toggle = (element) => { // hides element or raise TypeError
  if(typeof(element) != "object") {
    console.error(`TypeError: element expected but got ${typeof(element)} instead`);
  } else {
    if(element.hidden === true) {
      element.hidden = false;
    } else {
      element.hidden = true;
    }
  }
};
 
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
  let navItems = $(".nav-menu-items")
  if (menu) {
    menu.addEventListener("click", () => {
      menu.classList.toggle("menu-button-expanded");
      $toggle(navItems);
    });
  }
}


finishedloading();
expandMenu()