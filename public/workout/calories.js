import {
  getUserId,
  fetchData,
  handleError,
  fetchLoggedInUser,
  logOutHandler,
} from "../scripts/global.js";

const logout = document.querySelector("#logout");
const table = document.querySelector("table");

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
  return age;
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
  const url = `https://fitness-calculator.p.rapidapi.com/dailycalorie?age=${age}&gender=${
    gender === "other" ? "female" : gender
  }&height=${height}&weight=${weight}&activitylevel=${activity_level}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": RapidAPI.rapidApiKey,
      "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
    },
  };
  const [result, error] = await fetchData(url, options);
  console.log(result);
  console.log(url)
  if (error) return handleError(error);
  if (weight >= target_weight) {
    return {
      BMR: result.data.BMR,
      "Maintain weight": result.data.goals["maintain weight"],
      "Mild weight loss\n 0.5lb/week ":
        result.data.goals["Mild weight loss"].calory,
      "Weight loss 1\n lb/week": result.data.goals["Weight loss"].calory,
      "Extreme weight loss\n 2 lb/week":
        result.data.goals["Extreme weight loss"].calory,
    };
  } else {
    return {
      BMR: result.data.BMR,
      "Maintain weight": result.data.goals["maintain weight"],
      "Mild weight gain\n 0.5 lb/week":
      result.data.goals["Mild weight gain"].calory,
      "Weight gain \n1lb/week": result.data.goals["Weight gain"].calory,
      "Extreme weight gain\n 2 lb/week":
        result.data.goals["Extreme weight gain"].calory,
    };
  }
};

const fillTable = async () => {
  const data = await getCaloriesRecommendation();
  for (const key in data) {
    table.innerHTML += `
    <tr>
      <td>${key.replace(/\n/g, "<br>")}</td>
      <td>${Math.round(data[key])} Calories/day</td>
    </tr>
    `;
  }
};

fillTable();

