import {
  getUserId,
  fetchData,
  handleError,
  fetchLoggedInUser,
  logOutHandler,
} from "../scripts/global.js";

const logout = document.querySelector("#logout");

logout.addEventListener("click", logOutHandler);
document.addEventListener("DOMContentLoaded", async () => {
  const loggedInUser = await fetchLoggedInUser();
  if (!loggedInUser) window.location.href = "/";
  else {
    document.body.style.display = "block";
  }
});

const userData = async () => {
  const userId = await getUserId();
  const [data, error] = await fetchData(`/api/users/${userId}/progress`, {
    method: "GET",
  });
  if (error) return handleError(error);
  return data[0];
};

const convertToAge = (date) => {
  const currentDate = new Date();
  const birthDate = new Date(date);
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  return age - 1;
};

const getCaloriesRecommendation = async () => {
  const data = await userData();
  const {
    date_of_birth,
    gender,
    height,
    weight,
    activity_level,
    target_weight,
  } = data;
  const age = convertToAge(date_of_birth);
  const url = `https://fitness-calculator.p.rapidapi.com/dailycalorie?age=${age}&gender=${gender}&height=${height}&weight=${weight}&activitylevel=${activity_level}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": RapidAPI.rapidApiKey,
      "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
    },
  };
  const [result, error] = await fetchData(url, options);
  if (error) handleError(error);
  console.log(result);
  if (weight >= target_weight) {
    return {
      BMR: result.data.BMR,
      calories: result.data.goals["Mild weight loss"],
    };
  } else {
    return {
      BMR: result.data.BMR,
      calories: result.data.goals["Weight gain"],
    };
  }
};

getCaloriesRecommendation().then((calories) => {
  console.log(calories);
});
