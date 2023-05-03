const h2 = document.querySelector("#username");
const userHeight = document.querySelector("#height");
const userWeight = document.querySelector("#weight");
const userLevel = document.querySelector("#level");
const userBMI = document.querySelector("#bmi");
const logoutBtn = document.querySelector("#logoutBtn");
const ytBtn = document.querySelector("#ytBtn");
const searchYt = document.querySelector("#searchBar");

const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(response.statusText);
    if (response.status === 204) return [{}];
    return [await response.json()];
  } catch (error) {
    return [null, error];
  }
};

const fetchFrom = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const handleError = (error) => console.error(error.message);
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

const getUserId = async () => {
  try {
    const [data, error] = await fetchData("/api/me", { method: "GET" });
    if (error) handleError(error);
    console.log(data.id);
    return data.id;
  } catch (error) {
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
  console.log(data);

  const { user_Id, height, weight, bmi, activity_level } = data;

  console.log(activity_level);

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
  console.log(lbs);
  // const stats = await getUserStats();
  h2.innerText = username;
  userHeight.innerText = `Height: ${feet}' ${inches}''`;
  userWeight.innerText = `Weight : ${lbs} lbs`;
  userBMI.innerText = `BMI : ${bmi}`;
  // level.innerText = ` Activity Level : ${stats.activity_level}'s`;

  console.log(id);
  // logoutBtn.addEventListener("submit", async (e) => {
  //     e.preventDefault();
  //     logOutHandler();
  //     window.location.href = '../index.html';
  // });
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

ytBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const searchQuery = searchYt.value;

    yt(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${apiKey}`);
})

async function yt(url) {
    try{
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    }catch(error){
        console.log(error);
    }
   
}
