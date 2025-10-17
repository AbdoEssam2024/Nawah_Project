let itemsList = [];
let charts = [];
const thisYear = getThisYear();
const thisMonth = getThisMonth();
const thisWeek = getThisWeek();

// show happits after loading
document.addEventListener("DOMContentLoaded", () => {
  itemsList = getDataFromLocalStorage("happitsList");
  itemsList = itemsList.filter(
    (item) =>
      extractYear(item.happitDate) === thisYear &&
      extractMonth(item.happitDate) === thisMonth &&
      extractWeek(item.happitDate) === thisWeek
  );
  renderChart(itemsList);
  renderCounters(itemsList);
});

function renderCounters(items, week = thisWeek) {
  let happitsCount = document.getElementById("happits-count");
  let happitsDoneCount = document.getElementById("happits-done-count");
  let happitsPendingCount = document.getElementById("happits-pending-count");
  let scoreCount = document.getElementById("score-count");
  let score = document.querySelector(".counter");
  const todayDate = getDate();
  happitsCount.textContent = items.length;

  let done = items.filter((item) => item.completed[week - 1]).length;
  happitsDoneCount.textContent = done;

  let pendingCount = 0;
  items.forEach((item) => {
    if (item.happitMode === "desolate") {
      if (extractWeek(item.happitDate) < week) {
        pendingCount++;
      }
    } else {
      if (!item.completed[week - 1] && item.happitDate >= todayDate) {
        pendingCount++;
      }
    }
  });

  happitsPendingCount.textContent = pendingCount;

  let scoreResult = parseInt(((done / items.length) * 100).toFixed(0));

  if (scoreResult === "NaN" || items.length === 0) {
    scoreCount.textContent = 0 + " %";
  } else {
    scoreCount.textContent = scoreResult + " %";
  }

  if (scoreResult === "NaN" || items.length === 0) {
    score.style.borderRight = "5px solid black";
  }

  if (scoreResult >= 0 && scoreResult < 25) {
    score.style.borderRight = "5px solid red";
  }

  if (scoreResult >= 25 && scoreResult < 50) {
    score.style.borderRight = "5px solid orange";
  }

  if (scoreResult >= 50 && scoreResult < 75) {
    score.style.borderRight = "5px solid blue";
  }

  if (scoreResult >= 75 && scoreResult <= 100) {
    score.style.borderRight = "5px solid green";
  }
}

// Render Chart
function renderChart(items, week = thisWeek) {
  let timelineCounts = {};

  charts.forEach((chart) => {
    if (chart) {
      chart.destroy();
    }
  });

  items.forEach((item) => {
    if (item.completed[week - 1]) {
      if (timelineCounts[item.happitDay]) {
        timelineCounts[item.happitDay]++;
      } else {
        timelineCounts[item.happitDay] = 1;
      }
    }
  });

  const labelsValue = Object.keys(timelineCounts).map((key) => key);
  const dataValue = Object.values(timelineCounts).map((value) => value);
  const barColors = ["red", "green", "blue", "orange", "brown" , "purple" , "pink"];

  charts.push(
    new Chart(
      document.getElementById("chartTimeline"),
      {
        type: "bar",
        data: {
          labels: labelsValue,
          datasets: [
            {
              backgroundColor: barColors,
              data: dataValue,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: "center",
              align: "center",
              color: "#000",
              font: { weight: "bold", size: 12 },
            },
          },
        },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, max: 10 },
        },
        layout: { padding: { left: 20, right: 20 } },
      }
    )
  );
}

// filter chart by month and week
function filterChart() {
  let filterByWeek = document.getElementById("filterWeek");
  let selectedWeek = filterByWeek.value;
  switch (selectedWeek) {
    case "0":
      renderCounters(itemsList , thisWeek);
      renderChart(itemsList , thisWeek);
      break;
    case "1":
      renderCounters(itemsList, 1);
      renderChart(itemsList , selectedWeek);
      break;

    case "2":
      renderCounters(itemsList, 2);
      renderChart(itemsList , selectedWeek);
      break;

    case "3":
      renderCounters(itemsList, 3);
      renderChart(itemsList , selectedWeek);
      break;

    case "4":
      renderCounters(itemsList, 4);
      renderChart(itemsList , selectedWeek);
      break;

    default:
      renderCounters(itemsList);
      renderChart(itemsList , selectedWeek);
      break;
  }
}

/////// Helpers ///////

// Deal With Date
function getDate() {
  let date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const todayDate = `${year}-${month}-${day}`;
  return todayDate;
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

function extractYear(date) {
  const [year, month, day] = date.split("-");
  return year;
}

function extractMonth(date) {
  const [year, month, day] = date.split("-");
  return month;
}

function extractWeek(date) {
  const [year, month, day] = date.split("-");
  const week = Math.ceil(Number(day) / 7);
  return week;
}

// get data from local storage
function getDataFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// set data to local storage
function setDataToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
