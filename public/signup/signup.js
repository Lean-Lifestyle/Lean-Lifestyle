import { getUserId, fetchLoggedInUser } from "../scripts/global.js";

const form = document.querySelector("#form");
const emailInput = document.querySelector("#email");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const genderInput = document.querySelector("#gender");
const birthdayInput = document.querySelector("#birthday");
const errorMessage = document.querySelector("#error-message");

document.addEventListener("DOMContentLoaded", async () => {
  const user = await fetchLoggedInUser();
  if (user) window.location.href = "/dashboard";
  else {
    document.body.style.display = "block";
  }
});
const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      return [data];
    } else {
      throw { status: response.status, message: data.error };
    }
  } catch (error) {
    return [null, error];
  }
};

const handleError = async (error) => {
  console.error(error.message);
  errorMessage.textContent = error.message;
};

const data = [
  emailInput,
  usernameInput,
  passwordInput,
  genderInput,
  birthdayInput,
];

const eraseValues = () => data.forEach((item) => (item.value = ""));
const getValues = () => {
  return {
    email: emailInput.value,
    username: usernameInput.value,
    password: passwordInput.value,
    gender: genderInput.value,
    date_of_birth: birthdayInput.value,
  };
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("checking start");
  errorMessage.textContent = "";

  const values = getValues();
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  };
  const [data, error] = await fetchData("/api/users", option);
  if (error) return handleError(error);
  window.location.href = "/questions";
  eraseValues();
});
