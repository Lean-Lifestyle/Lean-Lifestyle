import { getUserId, fetchData, handleError } from "../scripts/global.js";

const h2 = document.querySelector("#username");
const userHeight = document.querySelector("#height");
const userWeight = document.querySelector("#weight");
const userLevel = document.querySelector("#level");
const userBMI = document.querySelector("#bmi");
const logoutBtn = document.querySelector("#logoutBtn");
const ytBtn = document.querySelector("#ytBtn");
const searchYt = document.querySelector("#searchBar");

const getUserName = async () => {
  try {
    const [data, error] = await fetchData("/api/me", { method: "GET" });
    if (error) handleError(error);
    console.log(data.username);
    return data.username;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const convertCMtoInches = (cm) => Math.round(cm / 2.54);
const convertInchesToFeet = (inches) => {
  return {
    feet: Math.round(inches / 12),
    inches: inches % 12,
  };
};
const covertKgTOLbs = (kg) => Math.round(kg * 2.20462);
// const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${apiKey}`;
// async function yt(url) {
//     try{
//         const response = await fetch(url);
//         return await response.json();
//     }catch(error){
//         console.log(error);
//     }

// }

const main = async () => {
  const username = await getUserName();
  const id = await getUserId();
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: id,
    }),
  };
  const [data, error] = await fetchData("/api/users/stats", option);
  if (error) handleError(error);

  const { height, weight, bmi, activity_level } = data;

  if (activity_level === "level_1") {
    userLevel.innerText = "Sedentary: little or no exercise";
  } else if (activity_level === "level_2") {
    userLevel.innerText = "Lightly active: 1-3 times/week";
  } else if (activity_level === "level_3") {
    userLevel.innerText = "Moderately active: 3-5 times/week";
  } else if (activity_level === "level_4") {
    userLevel.innerText =
      "Active: daily exercise or intense exercise 3-4 times/week ";
  } else if (activity_level === "level_5") {
    userLevel.innerText = "Very Active: intense exercise 6-7 times/week";
  } else if (activity_level === "level_6") {
    userLevel.innerText =
      "Extra Active: very intense exercise daily, or physical job";
  }

  const inche = convertCMtoInches(height);
  const { feet, inches } = convertInchesToFeet(inche);
  const lbs = covertKgTOLbs(weight);
  h2.innerText = username;
  userHeight.innerText = `Height: ${feet}' ${inches}''`;
  userWeight.innerText = `Weight : ${lbs} lbs`;
  userBMI.innerText = `BMI : ${bmi}`;
};

main();

logout.addEventListener("click", async (e) => {
  e.preventDefault();
  const option = {
    method: "DELETE",
    credentials: "include",
  };
  const [data, error] = await fetchData("/api/users/logout", option);
  if (error) return handleError(error);
  window.location.href = "/";
});

const form = document.querySelector("form");
const weightEl = document.querySelector("#change-weight");
const ctx = document.getElementById("myChart").getContext("2d");

const convertToKG = (weight) => Number((weight * 0.45359237).toFixed(3));

const userProgress = async () => {
  const userId = await getUserId();
  const [data, err] = await fetchData(`/api/users/${userId}/progress`, {
    method: "GET",
  });
  if (err) handleError(err);
  const weight = data.map((obj) => {
    const kg = obj.weight;
    return Math.round(kg * 2.20426);
  });
  const time = data.map((obj) => obj.created_at.slice(0, 10));
  return {
    weight,
    time,
  };
};

const main2 = async () => {
  const { weight, time } = await userProgress();
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: time,
      datasets: [
        {
          label: "Weight Progress in LB",
          data: weight,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(weightEl);
  console.log(weightEl.value);
  const kg = convertToKG(weightEl.value);
  const userId = await getUserId();
  const [data, err] = await fetchData(`/api/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ weight: kg }),
    headers: { "Content-Type": "application/json" },
  });
  if (err) handleError(err);
  window.location.reload();
});

main2();
