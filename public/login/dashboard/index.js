const logout = document.querySelector("#logout");

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
