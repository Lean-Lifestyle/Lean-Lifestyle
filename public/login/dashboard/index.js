import{
    logOutHandler,
    handleFetch,
} from '../scripts/global.js';

const h2 = document.querySelector("#username");
const height = document.querySelector("#height");
const weight = document.querySelector("#weight");
const level = document.querySelector("#level");
const logoutBtn = document.querySelector("#logoutBtn"); 

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
const getUserName = async () => {
    try{
        const [data, error] = await fetchData("/api/me", { method: "GET"});
        if(error) handleError(error);
        console.log(data.username);
        return data.username;
    }catch(error){
        console.log(error);
        return null;
    }
};

const getUserStats = async () => {
    try{
        const [data, error] = await fetchData("/api/me/stats", { method: "GET"});
        if(error) handleError(error);
        console.log(data);
        return data;
    }catch(error){
        console.log(error);
        return null;
    }
}

const main = async () => {
    const username = await getUserName();
    const stats = await getUserStats();
    height.innerText = `Height : ${stats.height} cm`;
    weight.innerText = `Weight : ${stats.weight} kg`;
    level.innerText = ` Activity Level : ${stats.activity_level}'s`;
    h2.innerText = username;

    // logoutBtn.addEventListener("submit", async (e) => {
    //     e.preventDefault();
    //     logOutHandler();
    //     window.location.href = '../index.html';
    // });

}

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
