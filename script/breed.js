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

const inputBreedEl = document.querySelector("#input-breed");
const inputTypeEl = document.querySelector("#input-type");
const submitBtnEl = document.querySelector("#submit-btn");
const tbodyEl = document.querySelector("#tbody");

// Declaration array that contain list of breeds
let arrBreeds = [];
let arrPets = [];
function Breed() {
  (this.id = arrBreeds.length + 1),
    (this.breed = inputBreedEl.value),
    (this.type = inputTypeEl.value),
    (this.functionAddToString = ""),
    (this.functionRemoveToString = ""),
    (this.functionCalBMIToString = ""),
    (this.add = function (array) {
      array.push(this);
      this.functionAddToString = this.add.toString();
      this.functionRemoveToString = this.remove.toString();
      saveToStorage("breeds", JSON.stringify(array));
    }),
    (this.remove = function (indexOfItem, array) {
      array.splice(indexOfItem, 1);
      removeFromStorage("breeds");
      saveToStorage("breeds", JSON.stringify(array));
    });
}
// Check relationship between Breeds & pets
const checkRelation = (breed) => {
  if (!getFromStorage("pets")) return;
  return arrPets.find((pet) => pet["breed"] === breed);
};
// Get pets from local storage to arrPets & covert functions from string using 'eval(`(${string})`)'
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
// validate input data
const validatationInput = () => {
  if (inputBreedEl.value.trim() === "") {
    inputBreedEl.focus();
    alert(`Please fill into the breed`);
    return false;
  }
  if (inputTypeEl.value === "Select Type") {
    inputTypeEl.focus();
    alert(`Please fill into the type`);
    return false;
  }
  return true;
};
// checking existence of object in the arrBreeds
const isExistent = (breedInput, arrBreeds) => {
  let index = arrBreeds.findIndex((breed) => {
    return breed.breed === breedInput;
  });
  if (index >= 0) return index;
  else return -1;
};
// clear Data from Form
const clearDataForm = () => {
  inputBreedEl.value = "";
  inputTypeEl.value = "Select Type";
};
// clear data from Table
const clearTableData = () => {
  const trEl = document.querySelectorAll("tr");
  if (trEl.length > 1)
    for (let i = 1; i < trEl.length; i++) tbodyEl.removeChild(trEl[i]);
};

const handleClickSubmit = () => {
  // check input data
  if (!validatationInput()) return;
  // check exsist
  if (arrBreeds.length > 0 && isExistent(inputBreedEl.value, arrBreeds) != -1) {
    alert(`This ${inputBreedEl.value} is already, please retype another breed`);
    inputBreedEl.focus();
    return;
  }

  const newBreed = new Breed();
  newBreed.add(arrBreeds); //add temPet to arrPets
  clearDataForm();
  clearTableData();
  // show data in the table
  renderTableData(arrBreeds);
  inputBreedEl.focus();
};
const deleteBreedInArr = (index) => {
  arrBreeds[index].remove(index, arrBreeds);
  // set the id number for all of breeds
  let i = 0;
  arrBreeds.map((breed) => {
    breed["id"] = ++i;
  });
  renderTableData(arrBreeds);
};
// create Element with value
const createElement = (elementName, value) => {
  let element = document.createElement(elementName);
  element.innerText = value;
  return element;
};
const renderTableData = (arrBreeds) => {
  const arrCol = ["thNumber", "tdBreed", "tdType", "tdAction"];
  for (let j = 0; j < arrBreeds.length; j++) {
    const tr = document.createElement("tr");
    tbodyEl.appendChild(tr);
    for (let i = 0; i < arrCol.length; i++) {
      switch (i) {
        case 0:
          arrCol[i] = createElement("td", arrBreeds[j].id);
          break;
        case 1:
          arrCol[i] = createElement("td", arrBreeds[j].breed);
          break;
        case 2:
          arrCol[i] = createElement("td", arrBreeds[j].type);
          break;
        case 3:
          let btnEl = createElement("button", "Delete");
          btnEl.classList.add("btn", "btn-danger");
          btnEl.value = `${j}`; // add index j into btn-value to be easy delete row base on index
          btnEl.addEventListener("click", () => {
            if (checkRelation(arrBreeds[j].breed)) {
              alert(
                `The breed '${arrBreeds[j].breed}' was used at Pet table. Can not delete.`
              );
              return;
            }
            let text = `Are you sure to delete the breed '${arrBreeds[j].breed}'?`;
            if (confirm(text)) {
              clearTableData(); //clear Table before delete breed in array. because after delete...
              deleteBreedInArr(j); //deleterBreedInArr will call renderTable()
            }
          });
          arrCol[i] = createElement("td", "");
          arrCol[i].appendChild(btnEl);
      }
      tr.appendChild(arrCol[i]);
    }
  }
};
getPetsAtLocalToArr();
getBreedsAtLocalToArr();
renderTableData(arrBreeds);
submitBtnEl.addEventListener("click", handleClickSubmit);
