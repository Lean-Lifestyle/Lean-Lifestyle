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

submitBtn.addEventListener("click", async (e) => {
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
  if (data) {
    console.log('you are good')
    // window.location.href = "/questions";
    return window.location.assign('./dashboard/index.html');
  }
})


