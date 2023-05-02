const form = document.querySelector("form");
const weight = document.querySelector("#weight");
const feet = document.querySelector("#height-feet");
const inches = document.querySelector("#height-inches");
const goalWeight = document.querySelector("#goalWeight");
const duration = document.querySelector("#duration");
const activityLevel = document.querySelector("#activity-level");
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

const calculateBMI = (weight, height) =>
  Number((weight / (height / 100) ** 2).toFixed(3));
const convertToCM = (feet, inches) => (feet * 12 + Number(inches)) * 2.54;
const convertToKG = (weight) => Number((weight * 0.45359237).toFixed(3));
const convertToDays = (duration) => duration * 7;

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const userId = await getUserId();
  const weightInKG = convertToKG(weight.value);
  const heightInCM = convertToCM(feet.value, inches.value);
  const targetWeight = convertToKG(goalWeight.value);
  const targetDuration = convertToDays(duration.value);
  const bmi = calculateBMI(weightInKG, heightInCM);
  const level =
    activityLevel.options[activityLevel.selectedIndex].getAttribute("level");
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      weight: weightInKG,
      height: heightInCM,
      bmi: bmi,
      activity_level: level,
      target_weight: targetWeight,
      target_duration: targetDuration,
    }),
  };
  const [data, error] = await fetchData("/api/users/questions", option);
  if (error) return handleError(error);
  console.log("Users Stats created");
  window.location.href = "/dashboard";
});
