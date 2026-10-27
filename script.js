// ============== API KEY ==================================================================================================================
const API_KEY = "1a3a711184193058692238745ce31487";






// ====================================== Manipuate DOM =====================================================================================
const theme = document.getElementsByClassName("theme");
const themeBtn = document.getElementById("themeBtn");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const errorMsg = document.getElementById("errorMsg");
const favoritesList = document.getElementById("favoritesList");
const addFavoriteBtn = document.getElementById("addfavoriteBtn");
const clearFavoritesBtn = document.getElementById("clearFavoritesBtn");
const favoritesBtn = document.getElementById("favoritesBtn");





// ================= taking data from server and checking valid or not =======================================================

async function getWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    if (response.status === 401) throw new Error('Invalid API key');
    if (response.status === 404) throw new Error('City not found');
    throw new Error('Something went wrong');
  }


  // ==================== asinging data into data variable =================================================================================
  const data = await response.json();
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
  };
}

let currentCity = "";

async function searchWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    errorMsg.textContent = "Please enter a city name";
    errorMsg.style.display = "block";
    return; // stop here
  }

  try {
    const data = await getWeather(city);
    currentCity = data.city;
    weatherCard.innerHTML = `
      <h1>${data.city}, ${data.country}</h1>
      <p>Temperature: ${data.temperature}°C</p>
      <p>Feels like: ${data.feelsLike}°C</p>
      <p>Description: ${data.description}</p>
      <p>Humidity: ${data.humidity}%</p>
      <p>Wind speed: ${data.windSpeed} m/s</p>`;
     weatherCard.style.display = "block";
     errorMsg.style.display = "none";
  } catch (error) {
    errorMsg.textContent = error.message;
    errorMsg.style.display = "block";
    weatherCard.style.display = "none";
  }
}

searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') searchWeather();
});

themeBtn.addEventListener('click',function(){
    document.body.classList.toggle('dark-theme');
    if(document.body.classList.contains('dark-theme')){
        themeBtn.textContent = "☀️"
        document.body.style.backgroundColor="black"
    }else{
        themeBtn.textContent = "🌙";
                document.body.style.backgroundColor="white"

    }
});

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function addfavorite(city){
  if(favorites.includes(city)){
    alert("City is already in favorites")
    return;
  }
    favorites.push(currentCity);
    //  alert("")
     localStorage.setItem("favorites",JSON.stringify(favorites))
     displayFavorites()

}
addFavoriteBtn.addEventListener('click', function() {
     addfavorite()
   
});



function displayFavorites() {
    favoritesList.innerHTML = '';
    favorites.forEach(each => {
        let div = document.createElement("div")
        div.textContent = each
        favoritesList.appendChild(div)

        div.addEventListener("click",()=>{
          cityInput.value = each
          searchWeather()
        })
    })

};

clearFavoritesBtn.addEventListener("click",()=>{
    favorites = favorites.filter(one => one !== currentCity)
    localStorage.setItem("favorites",JSON.stringify(favorites))
    displayFavorites()
        
});
favoritesBtn.addEventListener("click",()=>{
   displayFavorites()
})