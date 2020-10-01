"use strict";

const $ = function(x) {
  let result = document.querySelector(x) || undefined;
  return result
}
let requestStatus = 0;
const SUBMIT = $("#_button");
let login = document.forms[0][0];
let password = document.forms[0][1];


function getCookie(name) {
  let cookieValue = null;
  if(document.cookie) {
    const cookies = document.cookie.split(";");
    for(let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if(cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue
}


function tryToAuthenticate(login, password) {
  let logStatus = $("#_log");
  let csrf_token = getCookie("csrftoken");
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "login");
  xhr.setRequestHeader("X-CSRFToken", csrf_token);
  let json = JSON.stringify({
    "login" : login,
    "password" : password
  });
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.send(json);
    xhr.onload = function() {
      serverResponse(xhr, logStatus);
      requestStatus = 0; 
    }
}


function serverResponse(request, status) {
  let elemResponse = document.createElement("span");
  if(request.response === '') {
    elemResponse.innerHTML = `Неправильный логин или пароль`;
  } else {
    location.reload();
  }
  if (status.childElementCount !== 0) {
    for (let i = 0; i < status.childElementCount; i++) {
      status.children[i].remove();
    }
  }
  status.append(elemResponse);
}


let errormsg;
let formValidation;
function _init() {
  SUBMIT.addEventListener("click", function(){
    if(requestStatus === 0) {
      requestStatus = 1;
      formValidation = 0;
      if(!login.value.match(/(\S{1,12}$)*/)[0]){
        let incorrectLoginValue = raiseError("_errormsg");
        incorrectLoginValue.innerHTML = "Неккоректно введён логин";
        login.parentElement.append(incorrectLoginValue);
      } else {
        formValidation++;
      }
      if(!password.value) {
        let emptyPassField = raiseError("_emptyPassError");
        emptyPassField.innerHTML = "Поле пароля не заполнено"
        password.parentElement.append(emptyPassField);
      } else {
        formValidation++;
      }
      if(password.value !== '') {
        raiseError("_emptyPassError", 1);
      }
      if(formValidation === 2) {
        tryToAuthenticate(login.value, password.value);
      }
    } else if(requestStatus === 1){
      return
    }
  })
}


function raiseError(id, clear) {
  let errorMessage = $(`#${id}`);
  if (clear == 1 && errorMessage) {
    errorMessage.remove();
    return;
  }
  if (errorMessage == null) {
    errorMessage = document.createElement("div");
    errorMessage.id = `${id}`;
  } else {
    errorMessage.remove()
  }
  errorMessage.classList.add("error-message");
  return errorMessage
}

_init()