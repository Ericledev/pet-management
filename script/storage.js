"use strict";

function saveToStorage(key, value) {
  localStorage.setItem(key, value);
}

function getFromStorage(key) {
  return localStorage.getItem(key);
}

function removeFromStorage(key) {
  localStorage.removeItem(key);
}

// localStorage.setItem("ID", `{ "id": "PP", "petName": "aa", "age": "30" }`);
// localStorage.removeItem("firstName");
// localStorage.clear();
// console.log(localStorage["ID"]);
// // convert from OBJ to STR & versa
// console.log(JSON.stringify(JSON.parse(localStorage["ID"])));
// console.log(localStorage);
// // console.log(localStorage.);
