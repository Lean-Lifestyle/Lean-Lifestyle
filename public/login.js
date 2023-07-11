const form = document.querySelector("form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const submitBtn = document.querySelector("#submit");
const errorMessage = document.querySelector("#error-message");
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
const handleError = async (error) => {
  console.error(error.message);
  errorMessage.textContent = error.message;
};
const fetchLoggedInUser = async () => {
  const [response, _err] = await fetchData("/api/me", {
    credentials: "include",
  });
  if (response) {
    window.location.href = "/dashboard";
    return true;
  } else {
    document.body.style.display = "block";
    return false;
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
  return !!data;
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
  if (error) {
    if (error.message === "Not Found") {
      errorMessage.textContent = "User not found";
    } else if (error.message === "Unauthorized") {
      errorMessage.textContent = "Invalid password";
    } else {
      handleError(error);
    }
    return;
  }
  const userStats = await checkUsersStats(data.id);
  if (userStats) {
    window.location.href = "/dashboard";
  } else {
    window.location.href = "/questions";
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const loggedIn = await fetchLoggedInUser();
  if (loggedIn) {
    await fetchLoggedInUser();
  } else {
    form.addEventListener("submit", handleFormSubmit);
  }
});
