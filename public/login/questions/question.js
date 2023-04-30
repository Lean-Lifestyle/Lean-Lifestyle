const form = document.querySelector("form");
const weight = document.querySelector("#weightQuestion");
const height = document.querySelector("#heightQuestion");
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
    try{
        const response = await fetchData('/api/me', {  method: 'GET' });
        
        return response[0].user_id;
    }catch(error){
        return null;
    }
}

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const userId = await getUserId();
    const weightValue = weight.value;
    const heightValue = height.value;
    const calculateBMI = (weightValue, heightValue) => { return weightValue / (heightValue/100) ** 2;}
    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: userId,
            weight: weightValue,
            height: heightValue,
            bmi: calculateBMI(weightValue, heightValue),
        }),
    };
    const [data, error] = await fetchData("/api/users/questions", option);

    if (error) return handleError(error);
    if(data){
        console.log('Users Stats created');
    }
    
})