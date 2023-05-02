const form = document.querySelector("form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const submitBtn = document.querySelector("#submit");

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

const handleError = (error) => console.error(error.message);

const fetchLoggedInUser = async () => {
  const [response, _err] = await fetchData("/api/me", {
    credentials: "include",
  });
  if (response) {
    window.location.href = "/dashboard";
  } else {
    document.body.style.display = "block";
  }
};

const checkUsersStats = async (userId) => {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
    }),
  };
  const [data, error] = await fetchData("/api/users/stats", option);
  if (error) handleError(error);
  return data.length > 0;
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  const un = username.value;
  const pw = password.value;
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: un,
      password: pw,
    }),
  };
  const [data, error] = await fetchData("api/users/login", option);
  if (error) return handleError(error);
  const userStats = await checkUsersStats(data.id);
  if (userStats) {
    window.location.href = "/dashboard";
  } else {
    window.location.href = "/questions";
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await fetchLoggedInUser();
  submitBtn.addEventListener("click", handleFormSubmit);
});
