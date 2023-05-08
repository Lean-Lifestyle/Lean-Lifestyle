import {
  getUserId,
  fetchData,
  fetchLoggedInUser,
  handleError,
} from "../scripts/global.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = await fetchLoggedInUser();
  if (!user) window.location.href = "/";
  else {
    document.body.style.display = "flex";
  }
});

const widget = uploadcare.Widget("[role=uploadcare-uploader]");
const preview = document.getElementById("preview");
const img = document.querySelector("img");
widget.onUploadComplete((fileInfo) => {
  preview.src = fileInfo.cdnUrl;
  img.style.display = "block";
  upload.style.display = "block";
  document.querySelector(
    "#uploadcare--widget__text > div.uploadcare--link.uploadcare--widget__file-name"
  ).innerHTML = `<button>Change/Edit</button>`;
  document.querySelector("#uploadcare--widget__text > div.uploadcare--widget__file-size").innerHTML = "";
});

skip.addEventListener("click", () => {
  window.location.href = "/dashboard";
});

upload.addEventListener("click", async (e) => {
  e.preventDefault();
  const link = document.querySelector("#preview").src;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ image: link }),
  };
  const [data, error] = await fetchData("/api/upload-image", options);
  if (error) return handleError(error);
  window.location.href = "/dashboard";
});
