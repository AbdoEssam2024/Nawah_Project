let itemsList = [];
let thisYear = getThisYear();
let thisMonth = getThisMonth();
let thisWeek = getThisWeek();
let thisDay = getThisDay();

// show happits after loading
document.addEventListener("DOMContentLoaded", () => {
  // localStorage.clear();
  itemsList = getDataFromLocalStorage("happitsList");
  renderHappits(itemsList);
  renderThisMonthAndWeek(thisMonth, thisWeek);
});

// render happits
function renderHappits(items) {
  let happitsItems = document.getElementById("happits-items");
  const todayDate = getDate();

  if (items.length > 0) {
    if (!happitsItems.classList.contains("row")) {
      happitsItems.classList.add("row");
    }

    renderCounters(items);

    // create happits cards
    happitsItems.innerHTML = items
      .map((item) => (item.happitMode === "desolate" ? item : item))
      .map((item) => {
        return `
            <div id="happit-container" class="mt-2 col-12 col-md-4 col-lg-3">
              <div class="card p-2 border border-primary border-rounded-5">
                <div class="card-title d-flex justify-content-between align-items-center px-2 py-2 mb-1 mx-0 border border-1 rounded-3 ${
                  item.completed[thisWeek - 1]
                    ? "bg-success text-white"
                    : todayDate >= item.happitDate &&
                      item.happitMode === "desolate"
                    ? "bg-danger text-white"
                    : ""
                }">
                    <h6>${item.name}</h6>
                    <input id="happit-checkbox-${item.id}" type="checkbox" ${
          item.completed[thisWeek - 1] ? "checked" : ""
        } onclick="toggleHappitCompletion(${item.id})">
                </div>
                <hr style="margin: 0;">
                <div class="card-body px-1 py-1">
                    <p>${item.description}</p>
                    <p>${item.happitDay}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <p>${item.happitDate}</p>
                        <p>${item.hapitTime}</p>
                        <p>${item.happitMode}</p>
                    </div>
                </div>
                <div class="card-footer px-1 py-2 d-flex justify-content-between align-items-center">
                    <button class="btn btn-primary" onclick="passDataToModal(${
                      item.id
                    } , 'edit')">Edit</button>
                    <button class="btn btn-danger" onclick="passDataToModal(${
                      item.id
                    } , 'delete')">Delete</button>
                </div>
              </div> 
            </div>
        `;
      })
      .join("");
  } else {
    if (happitsItems.classList.contains("row")) {
      happitsItems.classList.remove("row");
      happitsItems.classList.add("text-center");
    }
    happitsItems.innerHTML = "No Happits Found";
  }
}

function renderCounters(data) {
  let happitsCount = document.getElementById("happits-count");
  let happitsDoneCount = document.getElementById("happits-done-count");
  let happitsPendingCount = document.getElementById("happits-pending-count");
  let passedCount = document.getElementById("passed-count");
  const todayDate = getDate();
  // View Happits Count
  happitsCount.textContent = data.length;
  happitsDoneCount.textContent = data.filter(
    (item) => item.completed[thisWeek - 1]
  ).length;

  let pendingCount = 0;
  data.forEach((item) => {
    if (item.happitMode === "desolate") {
      if (extractWeek(item.happitDate) < thisWeek) {
        pendingCount++;
      }
    } else {
      if (!item.completed[thisWeek - 1] && item.happitDate >= todayDate) {
        pendingCount++;
      }
    }
  });
  happitsPendingCount.textContent = pendingCount;

  let passCount = 0;
  data.forEach((item) => {
    if (item.happitMode === "desolate") {
      if (extractWeek(item.happitDate) > thisWeek) {
        passCount++;
      }
    } else {
      if (!item.completed[thisWeek - 1] && item.happitDate < todayDate) {
        passCount++;
      }
    }
  });
  passedCount.textContent = passCount;
}

// toggle happit completion
function toggleHappitCompletion(id) {
  const selectedHappit = itemsList.find((item) => item.id === id);
  const checkbox = document.getElementById(`happit-checkbox-${id}`);

  if (selectedHappit.completed[thisWeek - 1]) {
    checkbox.checked = selectedHappit.completed[thisWeek - 1];
    showToast("warning-message", "Happit Already Completed");
    return;
  }

  if (selectedHappit.happitMode === "desolate") {
    if (thisWeek < extractWeek(selectedHappit.happitDate)) {
      checkbox.checked = false;
      showToast("error-message", "Not Allowed Time Out , (Desolate Mode) !!");
      return;
    }

    if (thisWeek > extractWeek(selectedHappit.happitDate)) {
      checkbox.checked = false;
      showToast(
        "error-message",
        "Not Allowed HappitTime Not Started , (Desolate Mode) !!"
      );
      return;
    }
  }

  completeHappit(selectedHappit, checkbox);
}

// complete happit
function completeHappit(selectedHappit, checkbox) {
  checkbox.checked = selectedHappit.completed[thisWeek - 1];
  console.log("Before selectedHappit", selectedHappit.completed[thisWeek - 1]);
  document.getElementById(
    "note-title"
  ).textContent = `Leave a note for (${selectedHappit.name})`;
  openModal("notesModal");
  let confirmCompleteBtn = document.getElementById("confirm-complete");
  confirmCompleteBtn.addEventListener("click", function () {
    let note = document.getElementById("note").value;
    if (note === "") {
      document.getElementById("note").classList.add("is-invalid");
      return;
    }
    selectedHappit.note = note;
    selectedHappit.completed[thisWeek - 1] = true;
    selectedHappit.lastchecked = thisWeek;
    console.log("After selectedHappit", selectedHappit.completed[thisWeek - 1]);
    setDataToLocalStorage("happitsList", itemsList);
    showToast("success-message", "Happit Completed Successfully");
    renderHappits(itemsList);
    renderCounters(itemsList);
    document.getElementById("notesForm").reset();
    closeModal("notesModal");
  });
}

// filter happits by day
function filterHappitsByDay(day) {
  if (day === "all") {
    renderHappits(itemsList);
    renderCounters(itemsList);
  } else {
    let btnClicked = document.getElementById(day);
    btnClicked.setAttribute("active", "true");
    let filteredItems = itemsList.filter((item) => item.happitDay === day);
    renderHappits(filteredItems);
    renderCounters(filteredItems);
  }
}

// toggle buttons active state
const buttons = document.querySelectorAll(".btn-group .btn");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline-primary");
    });
    button.classList.remove("btn-outline-primary");
    button.classList.add("btn-primary");
  });
});

// add happit
function addHappit() {
  let name = document.getElementById("name").value;
  let description = document.getElementById("description").value;
  let happitDay = document.getElementById("happitDay").value;
  // let happitDate = document.getElementById("happitDate").value;
  let happitCreatedDate = getDate();
  let happitTime = document.getElementById("happitTime").value;
  let happitMode = document.getElementById("happitMode").value;

  if (name === "") {
    document.getElementById("name").classList.add("is-invalid");
    return;
  }

  if (happitDay === "") {
    document.getElementById("happitDay").classList.add("is-invalid");
    return;
  }

  // if (happitDate === "") {
  //   document.getElementById("happitDate").classList.add("is-invalid");
  //   return;
  // }

  if (happitTime === "") {
    document.getElementById("happitTime").classList.add("is-invalid");
    return;
  }

  if (happitMode === "") {
    document.getElementById("happitMode").classList.add("is-invalid");
    return;
  }

  const newHappit = {
    id: itemsList.length + 1,
    name: name,
    description: description,
    completed: [],
    happitDay: happitDay,
    happitDate: happitCreatedDate,
    hapitTime: happitTime,
    happitMode: happitMode,
  };

  itemsList.push(newHappit);
  setDataToLocalStorage("happitsList", itemsList);
  document.getElementById("addHappitForm").reset();

  // closeModal("addHappitModal");
  showToast("success-message", "Happit Added Successfully");
  renderHappits(itemsList);
  renderCounters(itemsList);
}

// delete happit
function deleteHappit(id, name) {
  document.getElementById("happit-name").textContent = `(${name})`;
  let confirmDeleteBtn = document.getElementById("confirm-delete");
  confirmDeleteBtn.setAttribute("data-id", id);

  confirmDeleteBtn.addEventListener("click", () => {
    itemsList = itemsList.filter((item) => item.id !== id);
    setDataToLocalStorage("happitsList", itemsList);
    renderHappits(itemsList);
    renderCounters(itemsList);
    closeModal("deleteHappitModal");
    showToast("success-message", "Happit Deleted Successfully");
  });
}

// edit happit
function editHappit(data) {
  const [
    id,
    name,
    description,
    completed,
    happitDay,
    happitDate,
    hapitTime,
    happitMode,
  ] = data;

  let editForm = document.getElementById("editHappitForm");
  let editName = document.getElementById("edit-name");
  let editDescription = document.getElementById("edit-description");
  let editHappitDay = document.getElementById("edit-happitDay");
  let editHappitDate = document.getElementById("edit-happitDate");
  let editHappitTime = document.getElementById("edit-happitTime");
  let editHappitMode = document.getElementById("edit-happitMode");

  editName.value = name;
  editDescription.value = description;
  editHappitDay.value = happitDay;
  editHappitDate.value = happitDate;
  editHappitTime.value = hapitTime;
  editHappitMode.value = happitMode;

  let confirmEditBtn = document.getElementById("confirm-edit");
  // Remove all previous event listeners by cloning the button
  let newConfirmEditBtn = confirmEditBtn.cloneNode(true);
  confirmEditBtn.parentNode.replaceChild(newConfirmEditBtn, confirmEditBtn);
  confirmEditBtn = newConfirmEditBtn;

  confirmEditBtn.addEventListener("click", () => {
    if (editName.value === "") {
      document.getElementById("edit-name").classList.add("is-invalid");
      return;
    }

    if (editHappitDay.value === "") {
      document.getElementById("edit-happitDay").classList.add("is-invalid");
      return;
    }

    if (editHappitDate.value === "") {
      document.getElementById("edit-happitDate").classList.add("is-invalid");
      return;
    }

    if (editHappitTime.value === "") {
      document.getElementById("edit-happitTime").classList.add("is-invalid");
      return;
    }

    const updatedHappit = {
      id: id,
      name: editName.value,
      description: editDescription.value,
      completed: completed,
      happitDay: editHappitDay.value,
      happitDate: editHappitDate.value,
      hapitTime: editHappitTime.value,
      happitMode: editHappitMode.value,
    };

    itemsList = itemsList.map((item) => {
      if (item.id === id) {
        item = updatedHappit;
        editForm.reset();
      }
      return item;
    });

    setDataToLocalStorage("happitsList", itemsList);
    renderHappits(itemsList);
    renderCounters(itemsList);
    closeModal("editHappitModal");
    showToast("success-message", "Happit Updated Successfully");
  });
}

function filterCategory(type) {
  let filterResult = [];
  const todayDate = getDate();

  if (type === "done") {
    filterResult = itemsList.filter((item) => item.completed[thisWeek -1]);
  } else if (type === "pending") {
    filterResult = itemsList.filter((item) => !item.completed[thisWeek -1] && todayDate <= item.happitDate);
  } else if (type === "passed") {
    filterResult = itemsList.filter(
      (item) => item.completed[thisWeek -1] && todayDate > item.happitDate
    );
  } else {
    filterResult = itemsList;
  }

  renderHappits(filterResult);
  renderCounters(filterResult);
}

function renderThisMonthAndWeek(month, week) {
  // let thisWeek = document.getElementById("thisWeek");
  let thisMonth = document.getElementById("thisMonth");
  switch (week) {
    case 1:
      thisMonth.textContent = " Week " + week + " : (1-7) " + getMonthName(month);
      break;
    case 2:
      thisMonth.textContent = " Week " + week + " : (8-14) " + getMonthName(month);
      break;
    case 3:
      thisMonth.textContent = " Week " + week + " : (15-21) " + getMonthName(month);
      break;
    case 4:
      thisMonth.textContent = " Week " + week + " : (22-28) " + getMonthName(month);
      break;
    default:
      thisMonth.textContent = " Week " + week + " : (29-31) " + getMonthName(month);
      break;
  }
}

function nextWeek() {
  if (thisWeek < 4) {
    thisWeek++;

    renderHappits(itemsList);
    renderThisMonthAndWeek(thisMonth, thisWeek);
    renderCounters(itemsList);
  }
  return;
}

function returnThisWeek() {
  thisWeek = getThisWeek();

  renderHappits(itemsList);
  renderThisMonthAndWeek(thisMonth, thisWeek);
  renderCounters(itemsList);
  return;
}

function prevWeek() {
  if (thisWeek >= 2) {
    thisWeek--;
    renderHappits(itemsList);
    renderThisMonthAndWeek(thisMonth, thisWeek);
    renderCounters(itemsList);
  }
  return;
}

//////////// Helper Functions ////////////

// passing data to modal and prepare To Delete
function passDataToModal(id, action) {
  const data = itemsList.find((item) => item.id === id);
  const todayDate = getDate();

  if (!data) {
    showToast("error-message", "Happit Not Found");
    return;
  }

  if (action == "delete") {
    openModal("deleteHappitModal");
    deleteHappit(data.id, data.name);
  }

  if (action == "edit") {
    if (data.completed[thisWeek - 1]) {
      showToast("warning-message", "Happit Already Completed");
      return;
    }

    if (data.happitMode === "desolate") {
      if (todayDate < data.happitDate) {
        showToast("error-message", "Not Allowed Time Out , (Desolate Mode)!!");
        return;
      }
      if (todayDate > data.happitDate) {
        showToast(
          "error-message",
          "Not Allowed HappitTime Not Started , (Desolate Mode)!!"
        );
        return;
      }
    }
    openModal("editHappitModal");
    editHappit(Object.values(data));
  }
}

// open modal
function openModal(id) {
  const myModal = document.getElementById(id);
  const modal = new bootstrap.Modal(myModal);
  modal.show();
}

// close modal
function closeModal(id) {
  const modal = bootstrap.Modal.getInstance(document.getElementById(id));
  modal.hide();
  // remove modal backdrop
  document.addEventListener("hidden.bs.modal", () => {
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
  });
}

// Deal With Date
function getDate() {
  let date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const todayDate = `${year}-${month}-${day}`;
  return todayDate;
}

function getThisYear() {
  let date = getDate();
  const [year, month, day] = date.split("-");
  return year;
}

function getThisMonth() {
  let date = getDate();
  const [year, month, day] = date.split("-");
  return month;
}

function getThisWeek() {
  let date = getDate();
  const [year, month, day] = date.split("-");
  const week = Math.ceil(Number(day) / 7);
  return week;
}

function getThisDay() {
  let date = getDate();
  const [year, month, day] = date.split("-");
  return day;
}

function extractYear(date) {
  const [year, month, day] = date.split("-");
  return year;
}

function extractMonth(date) {
  const [year, month, day] = date.split("-");
  return month;
}

function extractDay(date) {
  const [year, month, day] = date.split("-");
  return day;
}

function extractWeek(date) {
  const [year, month, day] = date.split("-");
  const week = Math.ceil(Number(day) / 7);
  return week;
}

// convert month number to month name
function getMonthName(monthNumber) {
  const months = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };
  return months[monthNumber] || monthNumber;
}

// show toast
function showToast(id, message) {
  let messageElement = document.getElementById(id);
  messageElement.classList.remove("d-none");
  messageElement.textContent = message;
  setTimeout(() => {
    messageElement.classList.add("d-none");
  }, 3000);
}

// get data from local storage
function getDataFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// set data to local storage
function setDataToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
