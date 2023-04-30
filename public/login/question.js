const form = document.querySelector("form");
const weight = document.querySelector("#weightQuestion");
const height = document.querySelector("#heightQuestion");
const submitBtn = document.querySelector("#submit");

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const weightValue = weight.value;
    const heightValue = height.value;
    const calculateBMI = (weightValue, heightValue) => { return weightValue / (heightValue/100) ** 2;}
    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            weight: weightValue,
            height: heightValue,
            bmi: calculateBMI(weightValue, heightValue),
        }),
    }
})