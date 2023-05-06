// Fetch Helpers
export const handleFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const { status, statusText, ok } = response;
    if (!ok) return [null, { status, statusText }];

    const content = status === 204 || (await response.json());
    return [content, null];
  } catch (error) {
    return [null, error];
  }
};

export const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(response.statusText);
    if (response.status === 204) return [{}];
    return [await response.json()];
  } catch (error) {
    return [null, error];
  }
};

export const handleError = (error) => console.error(error.message);

export const getUserId = async () => {
  try {
    const [data, error] = await fetchData("/api/me", { method: "GET" });
    if (error) handleError(error);
    return data.id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getFetchOptions = (body, method = "POST") => ({
  method,
  credentials: "include", // IMPORTANT, this tells fetch to include cookies
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// CREATE USER
export const signupAndLoginHandler = async (url, form) => {
  const formData = new FormData(form);
  const options = getFetchOptions(Object.fromEntries(formData.entries()));
  const [_response, err] = await handleFetch(url, options);
  if (err) {
    form.reset();
    return alert("Something went wrong");
  }
  window.location.assign("/user.html");
};

// READ USER
export const fetchLoggedInUser = async () => {
  const [response, _err] = await handleFetch("/api/me", {
    credentials: "include",
  });
  return response;
};

// UPDATE USER
export const updateUsernameHandler = async (form) => {
  const formData = new FormData(form);
  const username = formData.get("username");
  if (!username) return alert("Username is required");

  const url = `/api/users/${form.dataset.userId}`;
  const options = getFetchOptions({ username }, "PATCH");

  const [response, err] = await handleFetch(url, options);
  return [response, err];
};

// DELETE USER
export const logOutHandler = async (e) => {
  e.preventDefault();
  const [_response, err] = await handleFetch("/api/users/logout", {
    method: "DELETE",
  });
  if (err) return alert("Something went wrong");
  window.location.assign("/");
};

// Nav Helper
export const setNav = (hasLoggedInUser) => {
  const loggedOutNavHtml = `<ul>
    <li><a href="/">Home</a></li>
    <li><a href="./create.html">Sign Up</a></li>
    <li><a href="./login.html">Login</a></li>
  </ul>`;

  const loggedInNavHtml = `<ul>
    <li><a href="/">Home</a></li>
    <li><a href="./user.html">Profile</a></li>
  </ul>`;

  const navHtml = hasLoggedInUser ? loggedInNavHtml : loggedOutNavHtml;
  document.querySelector("nav").innerHTML = navHtml;
};

export default {
  handleFetch,
  fetchData,
  handleError,
  getFetchOptions,
  fetchLoggedInUser,
  signupAndLoginHandler,
  setNav,
  logOutHandler,
  updateUsernameHandler,
  getUserId,
};
