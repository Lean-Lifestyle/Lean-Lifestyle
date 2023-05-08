import {
  getUserId,
  fetchData,
  handleError,
  fetchLoggedInUser,
  logOutHandler,
} from "../scripts/global.js";

const h2 = document.querySelector("#username");
const userHeight = document.querySelector("#height");
const userWeight = document.querySelector("#weight");
const userLevel = document.querySelector("#level");
const userBMI = document.querySelector("#bmi");
const prev = document.querySelector("#prev");
const next = document.querySelector("#next");
const likeBtn = document.querySelector("#like-btn");
const likeCount = document.querySelector("#like-count");
const detail = document.querySelector("#detail");
const updateForm = document.querySelector("#update-weight");
const searchUser = document.querySelector("#search-user");
const weightEl = document.querySelector("#change-weight");
const ctx = document.getElementById("myChart").getContext("2d");
const profilePic = document.querySelector("#profile-pic");

document.addEventListener("DOMContentLoaded", async () => {
  const loggedInUser = await fetchLoggedInUser();
  if (!loggedInUser) window.location.href = "/";
  else {
    document.body.style.display = "block";
  }
});

let userId = await getUserId();
const realId = userId;
const removeThings = (userId) => {
  const remove = document.querySelectorAll(".remove");
  if (userId !== realId) {
    remove.forEach((el) => (el.style.display = "none"));
  } else {
    remove.forEach((el) => (el.style = `display: flex`));
  }
};

const totalUsers = async () => {
  const [countData, countError] = await fetchData("/api/users", {
    method: "GET",
  });
  if (countError) handleError(countError);
  return countData.length;
};

const getIdBasedOnUsername = async (username) => {
  const [data, err] = await fetchData(`/api/users`, {
    method: "GET",
  });
  if (err) handleError(err);
  const user = data.find((user) => user.username === username);
  return user ? user.id : null;
};

const showLikers = async (id) => {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  };
  const [data, error] = await fetchData("/api/likers", option);
  if (error) handleError(error);
  detail.innerHTML = `<summary>See who liked this progress</summary>`;
  const username = data.forEach((user) => {
    detail.innerHTML += `<li class="ul-item"><a class="user-link" href="#">@${user.username}</a></li>`;
  });
  const el = document.querySelectorAll(".user-link");
  el.forEach((a) => {
    a.addEventListener("click", async (e) => {
      const value = a.innerText.slice(1);
      const id = await getIdBasedOnUsername(value);
      main(id);
      userId = id;
    });
  });
  return username;
};
const deleteLike = async (id) => {
  const option = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ id: id }),
  };
  const [data, error] = await fetchData("/api/dlikes", option);
  if (error) handleError(error);
  return data.length;
};

const didLike = async (id) => {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ id: id }),
  };
  const [data, error] = await fetchData("/api/didLike", option);
  if (error) handleError(error);
  return data;
};

const determineLikeBtn = async (userId) => {
  const checkLike = await didLike(userId);
  if (checkLike) {
    likeBtn.innerHTML = "Unlike";
  } else {
    likeBtn.innerHTML = "Like";
  }
};

const createLike = async (id) => {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ likee_id: id }),
  };
  const [data, err] = await fetchData(`/api/likeCount`, option);
  if (err) return handleError(err);
  return !!data.length;
};

const convertCMtoInches = (cm) => Math.round(cm / 2.54);
const convertInchesToFeet = (inches) => ({
  feet: Math.floor(inches / 12),
  inches: inches % 12,
});
const convertKgTOLbs = (kg) => Math.round(kg * 2.20462);

let myChart;
const main = async (userId) => {
  const [data, error] = await fetchData(`/api/users/${userId}/progress`, {
    method: "GET",
  });

  if (error) handleError(error);
  if (data.length === 0) return;
  const {
    id,
    username,
    joined,
    height,
    weight,
    bmi,
    activity_level,
    target_weight,
  } = data[0];
  await showLikers(id);

  const targetWeight = convertKgTOLbs(target_weight);

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

  userLevel.innerText = `Activity Level: ${determineActivity(activity_level)}`;

  const { feet, inches } = convertInchesToFeet(convertCMtoInches(height));
  h2.innerText = `@${username}`;
  userHeight.innerText = `Height: ${feet}' ${inches}''`;
  userWeight.innerText = `Weight : ${convertKgTOLbs(weight)} lbs`;
  document.querySelector("#joined").innerHTML = `Joined: ${new Date(joined.slice(0, 10)).toLocaleDateString("en-US")}`;

  determineBMIRange(bmi);

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
        {
          label: "Target Weight",
          data: Array(weightArr.length).fill(targetWeight),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          borderDash: [5, 5],
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
  determineLikeBtn(userId);
  removeThings(userId);
  getUserPic(userId);
  if (res.length === 0) return;
  likeCount.innerText = res[0].likee_count;
};

main(userId);

logout.addEventListener("click", logOutHandler);

const convertToKG = (weight) => Number((weight * 0.45359237).toFixed(3));

updateForm.addEventListener("submit", async (e) => {
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

searchUser.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = document.querySelector("#search");
  const id = await getIdBasedOnUsername(user.value);
  if (!id) {
    alert("User not found");
    user.value = "";
    return;
  }
  userId = id;
  main(id);
  user.value = "";
});

prev.addEventListener("click", async (e) => {
  e.preventDefault();
  await determineLikeBtn(userId);
  if (userId === 1) {
    userId = await totalUsers();
  } else {
    userId--;
  }
  main(userId);
});

next.addEventListener("click", async (e) => {
  e.preventDefault();
  await determineLikeBtn(userId);
  if (userId === (await totalUsers())) {
    userId = 1;
  } else {
    userId++;
  }
  main(userId);
});

likeBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const checkLike = await didLike(userId);
  if (checkLike) {
    likeBtn.innerText = "Like";
    await deleteLike(userId);
    likeCount.innerText = Number(likeCount.innerText) - 1;
  } else {
    likeBtn.innerText = "Unlike";
    await createLike(userId);
    likeCount.innerText = Number(likeCount.innerText) + 1;
  }
  showLikers(userId);
});

function determineActivity(activity_level) {
  if (activity_level === "level_1") {
    return "Sedentary active";
  } else if (activity_level === "level_2") {
    return "Lightly active";
  } else if (activity_level === "level_3") {
    return "Moderately active";
  } else if (activity_level === "level_4") {
    return "Active";
  } else if (activity_level === "level_5") {
    return "Very Active";
  } else if (activity_level === "level_6") {
    return "Extra Active";
  }
}

function determineBMIRange(bmi) {
  if (bmi < 18.5) {
    userBMI.style = "background-color: blue; color: white";
    userBMI.innerText = `BMI : ${bmi} | Underweight`;
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    userBMI.style = "background-color: green";
    userBMI.innerText = `BMI : ${bmi} | Healthy`;
  } else if (bmi >= 25 && bmi <= 29.9) {
    userBMI.style = "background-color: yellow";
    userBMI.innerText = `BMI : ${bmi} | Overweight`;
  } else if (bmi >= 30 && bmi <= 34.9) {
    userBMI.style = "background-color: orange";
    userBMI.innerText = `BMI : ${bmi} | Obese`;
  } else if (bmi >= 35) {
    userBMI.style = "background-color: red";
    userBMI.innerText = `BMI : ${bmi} | Severely Obese`;
  }
}
async function getUserPic(userId) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: userId }),
  };
  const [data, error] = await fetchData("/api/send-image", options);
  if (error) handleError(error);
  if (!data.length) {
    profilePic.src = "../images/icon_profile.png";
  }
  const { image_link } = data[0];
  profilePic.src = image_link;
}

const originalStyles = profilePic.style.cssText;
profilePic.addEventListener("click", (e) => {
  profilePic.style = `
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
  `;
  e.stopPropagation();
  document.addEventListener(
    "click",
    (e) => {
      profilePic.style.cssText = originalStyles;
    },
    { once: true }
  );
});

changeProfile.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/user_image";
});
