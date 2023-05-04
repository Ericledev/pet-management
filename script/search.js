"use strict";
//Siderbar
// Toggle class active when click on navbar
const sidebarTitleEl = document.getElementById("sidebar-title");
const sidebarEl = document.getElementById("sidebar");
sidebarTitleEl.addEventListener("click", function () {
  sidebarEl.classList.toggle("active");
  // save 'active' of sidebar to local storage
  if (sidebarEl.classList.contains("active")) {
    saveToStorage("sidebar", "active");
  } else {
    saveToStorage("sidebar", "deactive");
  }
});
const functionLoadPage = () => {
  if (getFromStorage("sidebar") === "deactive")
    sidebarEl.classList.remove("active");
  else sidebarEl.classList.add("active");
};
window.onload = functionLoadPage;

// Decalaration properties for Form Input
const inputID = document.getElementById("input-id");
const inputName = document.getElementById("input-name");
const inputType = document.getElementById("input-type");
const inputBreed = document.getElementById("input-breed");
const inputVaccinated = document.getElementById("input-vaccinated");
const inputDewormed = document.getElementById("input-dewormed");
const inputSterilized = document.getElementById("input-sterilized");

const findBtn = document.getElementById("find-btn");

// Declaration properties for Table
const tbodyEl = document.querySelector("#tbody");

// Declaration array that contain list of pets
let arrPets = [];
let arrBreeds = [];

// Get pet from local storage to arrPets & covert functions from string using 'eval(`(${string})`)'
const getBreedsAtLocalToArr = () => {
  // check data in the local storage, if null => returnbreed
  if (!getFromStorage("breeds")) return;
  // else covert & copy to arrPets. using eval to covert the string to function
  arrBreeds = [...JSON.parse(getFromStorage("breeds"))];
  arrBreeds.map((breed) => {
    breed["add"] = eval(`(${breed["functionAddToString"]})`);
    breed["remove"] = eval(`(${breed["functionRemoveToString"]})`);
  });
};

// Get pet from local storage to arrPets & covert functions from string using 'eval(`(${string})`)'
const getPetsAtLocalToArr = () => {
  // check data in the local storage, if null => return
  if (!getFromStorage("pets")) return;
  // else covert & copy to arrPets. using eval to covert the string to function
  arrPets = [...JSON.parse(getFromStorage("pets"))];
  arrPets.map((pet) => {
    pet["add"] = eval(`(${pet["functionAddToString"]})`);
    pet["remove"] = eval(`(${pet["functionRemoveToString"]})`);
    pet["calBMI"] = eval(`(${pet["functionCalBMIToString"]})`);
  });
};

// Delete data from FORM after submit
const clearDataForm = () => {
  for (let i = 0; i < arrProps.length; i++) {
    if (i === 3) arrProps[i].value = "Select Type";
    else if (i === 7) arrProps[i].value = "Select Breed";
    else if (i === 6) arrProps[i].value = "#000000";
    else if (i === 8 || i === 9 || i === 10) arrProps[i].checked = false;
    else arrProps[i].value = "";
  }
};
// Render table
const renderTableData = (arrPets) => {
  const arrCol = [
    "thID",
    "tdName",
    "tdAge",
    "tdType",
    "tdWeight",
    "tdLength",
    "tdBreed",
    "tdColor",
    "tdVaccinated",
    "tdDewormed",
    "tdSterilized",
    // "BMI",
    "tdDateAdd",
    // "tdAction",
  ];
  // Create rows
  for (let j = 0; j < arrPets.length; j++) {
    const tr = document.createElement("tr");
    tbodyEl.appendChild(tr);
    for (let i = 0; i < arrCol.length; i++) {
      switch (i) {
        case 0:
          arrCol[i] = createElement("th", arrPets[j].id);
          break;
        case 1:
          arrCol[i] = createElement("td", arrPets[j].name);
          break;
        case 2:
          arrCol[i] = createElement("td", arrPets[j].age);
          break;
        case 3:
          arrCol[i] = createElement("td", arrPets[j].type);
          break;
        case 4:
          arrCol[i] = createElement("td", arrPets[j].weight + " kg");
          break;
        case 5:
          arrCol[i] = createElement("td", arrPets[j].length + " cm");
          break;
        case 6:
          arrCol[i] = createElement("td", arrPets[j].breed);
          break;
        case 7:
          // add class for tag <i>
          let iEl = createElement("i", "");
          iEl.classList.add("bi", "bi-square-fill");
          iEl.style.color = arrPets[j].color;

          arrCol[i] = createElement("td", "");
          arrCol[i].appendChild(iEl);
          break;
        case 8:
          // add class for tag <i>
          let iEl8 = createElement("i", "");
          iEl8.classList.add(
            "bi",
            arrPets[j].vaccinated ? "bi-check-circle-fill" : "bi-x-circle-fill"
          );

          arrCol[i] = createElement("td", "");
          arrCol[i].appendChild(iEl8);
          break;
        case 9:
          // add class for tag <i>
          let iEl9 = createElement("i", "");
          iEl9.classList.add(
            "bi",
            arrPets[j].dewormed ? "bi-check-circle-fill" : "bi-x-circle-fill"
          );

          arrCol[i] = createElement("td", "");
          arrCol[i].appendChild(iEl9);
          break;
        case 10:
          // add class for tag <i>
          let iEl10 = createElement("i", "");
          iEl10.classList.add(
            "bi",
            arrPets[j].sterilized ? "bi-check-circle-fill" : "bi-x-circle-fill"
          );

          arrCol[i] = createElement("td", "");
          arrCol[i].appendChild(iEl10);
          break;
        // case 11:
        //   arrCol[i] = createElement("td", arrPets[j].BMI);
        //   break;
        case 11:
          arrCol[i] = createElement("td", arrPets[j].addDate);
      }
      tr.appendChild(arrCol[i]);
    }
  }
};
// Clear table data
const clearTableData = () => {
  const trEl = document.querySelectorAll("tr");
  if (trEl.length > 1)
    for (let i = 1; i < trEl.length; i++) tbodyEl.removeChild(trEl[i]);
};
const filterPet = () => {
  let tempPets = arrPets
    .filter((pet) =>
      pet["id"].toUpperCase().includes(inputID.value.toUpperCase())
    )
    .filter((pet) =>
      pet["name"].toUpperCase().includes(inputName.value.toUpperCase())
    )
    .filter((pet) =>
      pet["type"]
        .toUpperCase()
        .includes(
          inputType.value != "Select Type" ? inputType.value.toUpperCase() : ""
        )
    )
    .filter((pet) =>
      pet["breed"]
        .toUpperCase()
        .includes(
          inputBreed.value != "Select Breed"
            ? inputBreed.value.toUpperCase()
            : ""
        )
    );
  // check the checkbox that is checked.
  if (inputVaccinated.checked) {
    tempPets = tempPets.filter(
      (pet) => pet.vaccinated === inputVaccinated.checked
    );
  }
  if (inputDewormed.checked) {
    tempPets = tempPets.filter((pet) => pet.dewormed === inputDewormed.checked);
  }
  if (inputSterilized.checked) {
    tempPets = tempPets.filter(
      (pet) => pet.sterilized === inputSterilized.checked
    );
  }
  return tempPets;
};
const handleOnClickFind = () => {
  const filteredPets = filterPet();
  clearTableData();
  // show data in the table
  renderTableData(filteredPets);
};
// create Element with value
const createElement = (elementName, value) => {
  let element = document.createElement(elementName);
  element.innerText = value;
  return element;
};

const insertBreedsToSelectInput = () => {
  // if arryBreedTemp == [], return
  if (!arrBreeds) return;

  // add 'option' element in 'select' tag
  //   inputBreed.appendChild(createElement("option", "Select Breed"));
  for (let i = 0; i < arrBreeds.length; i++) {
    let option = createElement("option", arrBreeds[i]["breed"]);
    inputBreed.appendChild(option);
  }
};
// Main action
// when page loadding
getBreedsAtLocalToArr();
insertBreedsToSelectInput();
getPetsAtLocalToArr();
// renderTableData(arrPets);

// onclick find button
findBtn.addEventListener("click", handleOnClickFind);
