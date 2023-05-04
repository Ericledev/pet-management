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
const inputAge = document.getElementById("input-age");
const inputType = document.getElementById("input-type");
const inputWeight = document.getElementById("input-weight");
const inputLength = document.getElementById("input-length");
const inputColor1 = document.getElementById("input-color-1");
const inputBreed = document.getElementById("input-breed");
const inputVaccinated = document.getElementById("input-vaccinated");
const inputDewormed = document.getElementById("input-dewormed");
const inputSterilized = document.getElementById("input-sterilized");
const submitBtn = document.getElementById("submit-btn");
const healthyBtn = document.getElementById("healthy-btn");
const bmiBtn = document.getElementById("BMI-btn");
let toggleHealthyPet = false; //show pet healthy if it = true
const arrProps = [
  inputID,
  inputName,
  inputAge,
  inputType,
  inputWeight,
  inputLength,
  inputColor1,
  inputBreed,
  inputVaccinated,
  inputDewormed,
  inputSterilized,
];
// Declaration properties for Table
const tbodyEl = document.querySelector("#tbody");

// Declaration array that contain list of pets
let arrPets = [];
let arrBreeds = [];

// Get breeds from local storage to arrPets & covert functions from string using 'eval(`(${string})`)'
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

// Declaration Contructor Pet Object & get data from FORM
function Pet() {
  (this.id = inputID.value),
    (this.name = inputName.value),
    (this.age = inputAge.value),
    (this.type = inputType.value),
    (this.weight = inputWeight.value),
    (this.length = inputLength.value),
    (this.color = inputColor1.value),
    (this.breed = inputBreed.value),
    (this.vaccinated = inputVaccinated.checked),
    (this.dewormed = inputDewormed.checked),
    (this.sterilized = inputSterilized.checked),
    (this.BMI = "?"),
    (this.addDate = getDate()),
    (this.functionAddToString = ""),
    (this.functionRemoveToString = ""),
    (this.functionCalBMIToString = ""),
    (this.add = function (array) {
      array.push(this);
      this.functionAddToString = this.add.toString();
      this.functionRemoveToString = this.remove.toString();
      this.functionCalBMIToString = this.calBMI.toString();
      saveToStorage("pets", JSON.stringify(array));
    }),
    (this.remove = function (indexOfItem, array) {
      array.splice(indexOfItem, 1);
      // removeFromStorage("pets");
      saveToStorage("pets", JSON.stringify(array));
    }),
    (this.calBMI = function () {
      if (this.type === "Dog")
        this.BMI = ((this.weight * 703) / this.length ** 2).toFixed(2);
      else {
        this.BMI = ((this.weight * 886) / this.length ** 2).toFixed(2);
      }
    });
}
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
// VALIDATION INPUT
const validatationInput = () => {
  //   console.log("Check vaccinate: ", inputVaccinated.checked);
  let check = true; // check = true if validate is ok, else false

  for (let i = 0; i < arrProps.length - 3; i++) {
    //(arrProps.length-3 that mean, do not check 3 last elements-checkbox)
    // check empty
    if (
      arrProps[i].value.trim() === "" ||
      arrProps[i].value === "Select Type" ||
      arrProps[i].value === "Select Breed"
    ) {
      arrProps[i].focus();
      alert(`Please fill into the ${arrProps[i].id}`);
      check = false;
      break;
      // check value is not less than 1
    } else {
      if (
        (i === 2 || i === 4) &&
        (Number(arrProps[i].value) <= 0 || Number(arrProps[i].value) > 15)
      ) {
        arrProps[i].focus();
        alert(`Please fill into the value from 1->15`);
        check = false;
        break;
      } else if (
        i === 5 &&
        (Number(arrProps[i].value) <= 0 || Number(arrProps[i].value) > 100)
      ) {
        arrProps[i].focus();
        alert(`Please fill into the value from 1->100`);
        check = false;
        break;
      }
    }
    if (i === arrProps.length - 1) check = true;
  }
  return check;
};
// checking existence of object in the arrPets
const isExistent = (petInputID, arrPets) => {
  let index = arrPets.findIndex((pet) => {
    return pet.id === petInputID;
  });
  if (index >= 0) return index;
  else return -1;
};
const filterPetHealthy = () => {
  const arrHealthyPet = arrPets.filter((pet) => {
    return (
      pet.vaccinated === true &&
      pet.dewormed === true &&
      pet.sterilized === true
    );
  });
  return arrHealthyPet;
};
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
    "BMI",
    "tdDateAdd",
    "tdAction",
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
        case 11:
          arrCol[i] = createElement("td", arrPets[j].BMI);
          break;
        case 12:
          arrCol[i] = createElement("td", arrPets[j].addDate);
          break;
        case 13:
          let btnEl = createElement("button", "Delete");
          btnEl.classList.add("btn", "btn-danger");
          btnEl.value = `${j}`; // add index j into btn-value to be easy delete row base on index
          btnEl.addEventListener("click", () => {
            try {
              if (!toggleHealthyPet) {
                let text = `Are you sure to delete the row under ID: ${arrPets[j].id}?`;
                if (confirm(text)) {
                  clearTableData(); //clear Table before delete pet in array. because after delete
                  deletePetInArr(j); //deleterPetInArr will call renderTable()
                }
              } else
                alert(
                  "You are in the healthy pets view mode. Can not delete pet."
                );
            } catch (error) {
              alert(
                `Error functions structure while import data. May not be deleting, editing or BMI calculating.
Make sure that data is imported is correct function struture`
              );
              clearTableData();
              renderTableData(arrPets);
            }
          });

          arrCol[i] = createElement("td", "");
          arrCol[i].appendChild(btnEl);
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
const deletePetInArr = (index) => {
  arrPets[index].remove(index, arrPets);
  renderTableData(arrPets);
};

const handleOnClickSubmit = () => {
  // ADD NEW PET INTO ARRAY
  // 1/ validatation of input
  if (validatationInput()) {
    // 2/ check exist ID.
    // 3/ if true => item is existed can not add
    if (arrPets.length > 0 && isExistent(inputID.value, arrPets) != -1) {
      alert("The id is already, please retype another id");
      inputID.focus();
    } else {
      // 4/ else => create newPet obeject && get data from FORM add pet to arrPets
      const newPet = new Pet();
      newPet.add(arrPets); //add temPet to arrPets
      clearDataForm();
      clearTableData();
      // show data in the table
      renderTableData(arrPets);
    }
  }
};
// create Element with value
const createElement = (elementName, value) => {
  let element = document.createElement(elementName);
  element.innerText = value;
  return element;
};
// Make function getDate format dd/mm/yyyy
const getDate = () => {
  let tempDate = new Date();
  let stringDate = `${
    tempDate.getDate() > 9 ? tempDate.getDate() : "0" + tempDate.getDate()
  }/${
    tempDate.getMonth() + 1 > 9
      ? tempDate.getMonth() + 1
      : "0" + (tempDate.getMonth() + 1)
  }/${tempDate.getFullYear()}`;
  return stringDate;
};
const handleOnClickShowPet = () => {
  toggleHealthyPet = !toggleHealthyPet;
  clearTableData();
  if (toggleHealthyPet) {
    const healthyPets = filterPetHealthy();
    healthyBtn.textContent = "Show All Pets";
    submitBtn.disabled = true;
    renderTableData(healthyPets);
  } else {
    healthyBtn.textContent = "Show Healthy Pets";
    submitBtn.disabled = false;
    renderTableData(arrPets);
  }
};
const handlOnClickCalBMI = () => {
  if (toggleHealthyPet) {
    alert("You are in view mode health pets, can not calculate BMI of pet!.");
  } else {
    for (let i = 0; i < arrPets.length; i++) {
      arrPets[i].calBMI();
    }
    clearTableData();
    renderTableData(arrPets);
  }
};
// REMOVE ITEM FROM ARRAY
// 1/ check exist.
// 2/ if true => remove item
// 3/ else => item is existed can not remove
const handleOnchangeInputType = () => {
  // alert("change me.");
  if (inputType.value === "Select Type") {
    inputBreed.disabled = true;
    inputBreed.value = "Select Breed";
    return;
  }
  inputBreed.disabled = false;
  // fillter breed to append input Type

  // const filBreed = arrBreeds
  let arrBreedTemp = arrBreeds.filter(
    (breed) => breed.type === inputType.value
  );
  // if arryBreedTemp == [], return
  if (!arrBreedTemp) return;

  // inputBreed.removeChild("option");
  while (inputBreed.hasChildNodes()) {
    inputBreed.removeChild(inputBreed.firstChild);
  }
  inputBreed.appendChild(createElement("option", "Select Breed"));
  for (let i = 0; i < arrBreedTemp.length; i++) {
    let option = createElement("option", arrBreedTemp[i]["breed"]);
    inputBreed.appendChild(option);
  }
};
// Onclick Btn
getBreedsAtLocalToArr();
getPetsAtLocalToArr();
renderTableData(arrPets);
inputType.addEventListener("change", handleOnchangeInputType);
submitBtn.addEventListener("click", handleOnClickSubmit);
healthyBtn.addEventListener("click", handleOnClickShowPet);
bmiBtn.addEventListener("click", handlOnClickCalBMI);
