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

const inputFileEl = document.querySelector("#input-file");
const importBtnEl = document.querySelector("#import-btn");
const exportBtnEl = document.querySelector("#export-btn");
// console.log(typeof getFromStorage("pets"));
let arrPetsImport = [];
let arrPets = [];
let arrTemp = [];
let choosedFile = false;
let isSameStructure = false;

// Export data to file
const handleClickExport = () => {
  // Save-as file, using FileSaver library.
  var blob = new Blob([getFromStorage("pets")], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, "Backup-Data.json");
};

// Merge array from local & .json file
const mergeArrUni = (arrLocal, arrImport) => {
  const arrLocalLength = arrLocal.length;
  let temptIndex = -1;
  for (let i = 0; i < arrImport.length; i++) {
    temptIndex = arrLocal.findIndex((item) => item.id === arrImport[i].id);
    if (temptIndex != -1) {
      arrLocal[temptIndex] = arrImport[i];
    } else {
      temptIndex = -1;
      arrTemp.push(arrImport[i]);
    }
  }
  arrPets = [...arrLocal, ...arrTemp];
};

const handleClickImport = () => {
  if (!choosedFile) {
    alert(
      "To be not .json file or you have not choosed, yet. Please choose again ..."
    );
    return;
  }
  if (!isSameStructure) {
    alert(
      "The structure of .json file is not correct. Please check .json file."
    );
    inputFileEl.value = "";
    inputFileEl.focus();
    return;
  }

  getPetsAtLocalToArr();
  mergeArrUni(arrPets, arrPetsImport);
  saveToStorage("pets", JSON.stringify(arrPets));
  alert("Importation file is succeed.");
};
// Get data from local storage
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
// Get data from file .json
const getPetsAtFileToArr = (text) => {
  try {
    // else covert & copy to arrPets. using eval to covert the string to function
    arrPetsImport = [...JSON.parse(text)];

    for (let i = 0; i < arrPetsImport.length; i++) {
      //check struture
      if (
        !arrPetsImport[i]["name"] ||
        !arrPetsImport[i]["id"] ||
        !arrPetsImport[i]["age"] ||
        !arrPetsImport[i]["type"] ||
        !arrPetsImport[i]["weight"] ||
        !arrPetsImport[i]["length"] ||
        !arrPetsImport[i]["breed"] ||
        !arrPetsImport[i]["vaccinated"].toString() ||
        !arrPetsImport[i]["dewormed"].toString() ||
        !arrPetsImport[i]["sterilized"].toString() ||
        !arrPetsImport[i]["BMI"] ||
        !arrPetsImport[i]["addDate"] ||
        !arrPetsImport[i]["color"] ||
        !arrPetsImport[i]["functionAddToString"] ||
        !arrPetsImport[i]["functionRemoveToString"] ||
        !arrPetsImport[i]["functionCalBMIToString"]
      ) {
        console.log("check Id in false: ", arrPetsImport[i]["id"]);
        arrPetsImport = [];
        isSameStructure = false;
        break;
      } else {
        console.log("check Id in true, : ", arrPetsImport[i]["id"]);
        arrPetsImport[i]["add"] = eval(
          `(${arrPetsImport[i]["functionAddToString"]})`
        );
        arrPetsImport[i]["remove"] = eval(
          `(${arrPetsImport[i]["functionRemoveToString"]})`
        );
        arrPetsImport[i]["calBMI"] = eval(
          `(${arrPetsImport[i]["functionCalBMIToString"]})`
        );
      }
      isSameStructure = true;
    }
  } catch (error) {
    arrPetsImport = [];
    isSameStructure = false;
  }
};
const handleChangeInput = async (evt) => {
  //REF: https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers
  const file = evt.target.files.item(0);
  console.log("Check file1: ", evt.target.value);
  console.log("Check file2: ", file);
  if (!file || file.type != "application/json") {
    choosedFile = false;
    return;
  }

  // ussing fetch data from url localhost
  // const fetchData = await fetch("../data-export.json");
  // let myData;
  // await fetchData.json().then((data) => (myData = data));
  // console.log("Check fetchData: ", myData);

  choosedFile = true;
  const text = await file.text();
  getPetsAtFileToArr(text);
};

inputFileEl.addEventListener("change", handleChangeInput);

importBtnEl.addEventListener("click", handleClickImport);
exportBtnEl.addEventListener("click", handleClickExport);
