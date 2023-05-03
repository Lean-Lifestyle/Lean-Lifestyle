import { getUserId, fetchData, handleError } from "../scripts/global.js";

const form = document.querySelector("form");
const weight = document.querySelector("#weight");
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
    return kg * 2.20426;
  });
  const time = data.map((obj) => obj.created_at.slice(0, 10));
  return {
    weight,
    time,
  };
};

const main = async () => {
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
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const kg = convertToKG(weight.value);
  const userId = await getUserId();
  const [data, err] = await fetchData(`/api/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ weight: kg }),
    headers: { "Content-Type": "application/json" },
  });
  if (err) handleError(err);
  window.location.reload();
});

main();
