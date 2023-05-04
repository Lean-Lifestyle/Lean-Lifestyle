import { getUserId, fetchData, handleError } from "../scripts/global.js";

const h2 = document.querySelector("#username");
const userHeight = document.querySelector("#height");
const userWeight = document.querySelector("#weight");
const userLevel = document.querySelector("#level");
const userBMI = document.querySelector("#bmi");
const ytBtn = document.querySelector("#ytBtn");
const searchYt = document.querySelector("#searchBar");
const prev = document.querySelector("#prev");
const next = document.querySelector("#next");
const likeBtn = document.querySelector("#like-btn");
const likeCount = document.querySelector("#like-count");

// const getUserName = async () => {
//   try {
//     const [data, error] = await fetchData("/api/me", { method: "GET" });
//     if (error) handleError(error);
//     console.log(data.username);
//     return data.username;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

const convertCMtoInches = (cm) => Math.round(cm / 2.54);
const convertInchesToFeet = (inches) => {
  return {
    feet: Math.round(inches / 12),
    inches: inches % 12,
  };
};
const covertKgTOLbs = (kg) => Math.round(kg * 2.20462);

let myChart;
const main = async (userId) => {
  const [data, error] = await fetchData(`/api/users/${userId}/progress`, {
    method: "GET",
  });

  if (error) handleError(error);
  if (data.length === 0) return;

  const { id, username, height, weight, bmi, activity_level } = data[0];
  const weightArr = data.map((user) =>
    Math.round(user.changed_weight * 2.20462)
  );
  const timeArr = data.map((user) =>
    new Date(user.time.slice(0, 10)).toLocaleDateString("en-US")
  );
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  };

  const [res, error2] = await fetchData("/api/likes", option);
  if (error2) handleError(error2);
  likeCount.innerText = res[0].likee_count;

  userLevel.innerText = determineActivity(activity_level);

  const inche = convertCMtoInches(height);
  const { feet, inches } = convertInchesToFeet(inche);
  const lbs = covertKgTOLbs(weight);
  h2.innerText = username;
  userHeight.innerText = `Height: ${feet}' ${inches}''`;
  userWeight.innerText = `Weight : ${lbs} lbs`;
  userBMI.innerText = `BMI : ${bmi}`;

  if (myChart) myChart.destroy();
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: timeArr,
      datasets: [
        {
          label: "Weight Progress in LB",
          data: weightArr,
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

function determineActivity(activity_level) {
  if (activity_level === "level_1") {
    return "Sedentary: little or no exercise";
  } else if (activity_level === "level_2") {
    return "Lightly active: 1-3 times/week";
  } else if (activity_level === "level_3") {
    return "Moderately active: 3-5 times/week";
  } else if (activity_level === "level_4") {
    return "Active: daily exercise or intense exercise 3-4 times/week ";
  } else if (activity_level === "level_5") {
    userLevel.innerText = "Very Active: intense exercise 6-7 times/week";
  } else if (activity_level === "level_6") {
    return "Extra Active: very intense exercise daily, or physical job";
  }
}

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

form.addEventListener("submit", async (e) => {
  e.preventDefault();
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

let userId = await getUserId();
main(userId);
prev.addEventListener("click", async (e) => {
  e.preventDefault();
  main(userId);
  userId--;
});

next.addEventListener("click", async (e) => {
  e.preventDefault();
  main(userId);
  console.log("next:", userId);
  userId++;
});

likeBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ likee_id: userId }),
  };

  const [data, err] = await fetchData(`/api/likeCount`, option);
  if (err) handleError(err);
  console.log("like:", userId);
});
