import {
  getUserId,
  fetchLoggedInUser,
  fetchData,
  handleError
} from '../scripts/global.js';

const form = document.querySelector("form");
const weight = document.querySelector("#weight");
const feet = document.querySelector("#height-feet");
const inches = document.querySelector("#height-inches");
const goalWeight = document.querySelector("#goalWeight");
const duration = document.querySelector("#duration");
const activityLevel = document.querySelector("#activity-level");
const submitBtn = document.querySelector("#submit");

document.addEventListener("DOMContentLoaded", async () => {
  const loggedInUser = await fetchLoggedInUser();
  if (!loggedInUser) window.location.href = "/";
  document.body.style.display = "block";
});


const calculateBMI = (weight, height) =>
  Number((weight / (height / 100) ** 2).toFixed(3));
const convertToCM = (feet, inches) => (feet * 12 + Number(inches)) * 2.54;
const convertToKG = (weight) => Number((weight * 0.45359237).toFixed(3));
const convertToDays = (duration) => duration * 7;

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const userId = await getUserId();
  const weightInKG = convertToKG(weight.value);
  const heightInCM = convertToCM(feet.value, inches.value);
  const targetWeight = convertToKG(goalWeight.value);
  const targetDuration = convertToDays(duration.value);
  const bmi = calculateBMI(weightInKG, heightInCM);
  const level =
    activityLevel.options[activityLevel.selectedIndex].getAttribute("level");
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      weight: weightInKG,
      height: heightInCM,
      bmi: bmi,
      activity_level: level,
      target_weight: targetWeight,
      target_duration: targetDuration,
    }),
  };
  const [data, error] = await fetchData("/api/users/questions", option);
  if (error) return handleError(error);
  window.location.href = "../dashboard/index.html";
  console.log("Users Stats created");
  window.location.href = "/dashboard";
});
