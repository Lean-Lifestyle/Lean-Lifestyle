window.addEventListener("DOMContentLoaded", async () => {
  const api = apiKey.ninjaKey;
  const apiYT = apiKey.ytKey;
  const searchBar = document.querySelector("#searchBar");
  const searchForm = document.querySelector("#searchForm");
  const muscleSelector = document.querySelector("#muscle");
  const muscleForm = document.querySelector("#muscleForm");
  const difficultySelector = document.querySelector("#difficulty");
  const exerciseContainer = document.querySelector("#exercise-container");

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const searchQuery = searchBar.value;
      console.log(searchQuery);
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?q=${searchQuery}&key=${apiYT}&part=snippet&type=video`;
      //add another 4 vidoes
      const response = await fetch(apiUrl);
      const data = await response.json();
      onYouTubeIframeAPIReady(
        data.items[0].id.videoId,
        data.items[1].id.videoId,
        data.items[2].id.videoId,
        data.items[3].id.videoId,
        data.items[4].id.videoId
      );
      createPlayers();
    } catch (error) {
      console.log(error);
      return null;
    }
  });

  muscleForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const muscle = muscleSelector.value;
      const difficulty = difficultySelector.value;
      const apiUrl = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}&difficulty=${difficulty}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-Api-Key": api,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      let first = exerciseContainer.firstChild;
      while (first) {
        exerciseContainer.removeChild(first);
        first = exerciseContainer.firstChild;
      }
      if (data.length === 0) {
        let player = document.createElement("div");
        player.innerHTML = `<h3>No exercises found</h3>`;
        player.style =
          "margin: auto; padding: 10%;border-radius: 17vw;background-color:antiquewhite;text-align: left;";
        exerciseContainer.appendChild(player);
      }
      for (let i = 0; i < 3; i++) {
        const regex = /(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/g;
        const sentences = data[i].instructions.split(regex);
        let player = document.createElement("div");
        player.id = "exercise" + i;
        exerciseContainer.appendChild(player);
        player.innerHTML = `<h3><strong>${data[
          i
        ].name.toUpperCase()}</strong> [${
          data[i].difficulty
        }]</h3><h4><strong>${data[i].equipment}</strong></h4>`;
        let olList = document.createElement("ol");
        player.appendChild(olList);
        sentences.forEach((sentence) => {
          let li = document.createElement("li");
          li.innerHTML = sentence;
          olList.appendChild(li);
        });

        player.style =
          "margin: auto; border: 1px solid yellow; padding: 10%;border-radius: 10rem;background-color:antiquewhite;text-align: left;";
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  });
});

const onYouTubeIframeAPIReady = (id1, id2, id3, id4) => {
  resetPlayers();
  createPlayers();
  player1 = new YT.Player("player1", {
    height: "360",
    width: "640",
    videoId: id1,
  });
  player2 = new YT.Player("player2", {
    height: "360",
    width: "640",
    videoId: id2,
  });
  player3 = new YT.Player("player3", {
    height: "360",
    width: "640",
    videoId: id3,
  });
  player4 = new YT.Player("player4", {
    height: "360",
    width: "640",
    videoId: id4,
  });
};
const resetPlayers = () => {
  if (player1) {
    let player1Iframe = document.getElementById("player1");
    player1Iframe.remove();
    player1 = null;
  }
  if (player2) {
    let player2Iframe = document.getElementById("player2");
    player2Iframe.remove();
    player2 = null;
  }
  if (player3) {
    let player3Iframe = document.getElementById("player3");
    player3Iframe.remove();
    player3 = null;
  }
  if (player4) {
    let player4Iframe = document.getElementById("player4");
    player4Iframe.remove();
    player4 = null;
  }
};

const createPlayers = () => {
  let player1 = document.createElement("div");
  player1.id = "player1";
  player1.style = "margin:1rem;";
  document.querySelector(".sector1").appendChild(player1);

  let player2 = document.createElement("div");
  player2.id = "player2";
  player2.style = "margin:1rem;";
  document.querySelector(".sector2").appendChild(player2);

  let player3 = document.createElement("div");
  player3.id = "player3";
  player3.style = "margin:1rem;";
  document.querySelector(".sector3").appendChild(player3);

  let player4 = document.createElement("div");
  player4.id = "player4";
  player4.style = "margin:1rem;";
  document.querySelector(".sector4").appendChild(player4);
};
