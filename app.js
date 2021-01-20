let form = document.querySelector("form");
let locations = document.querySelector(".locations");
const api = new API();

/* Add the city to the UI */
const addCity = (cityInfo) => {
    const {locDetails, locWeather} = cityInfo;
    let imgSrc = locWeather.IsDayTime ? "img/day.svg" : "img/night.svg";
    let iconSrc = `img/icons/${locWeather.WeatherIcon}.svg`;
    /* Delete if the city already exists */
    let exists = document.getElementById(`city-${locDetails.EnglishName}`);
    if (exists != null) {
        exists.remove();
    }
    locations.innerHTML = `<div class="card" id="city-${locDetails.EnglishName}">
                                <div class="picture" style="background-image: url('${imgSrc}')"></div>
                                <div class="info">
                                    <img src="${iconSrc}">
                                    <h3>${locDetails.EnglishName}</h3>
                                    <span>${locWeather.WeatherText}</span>
                                    <h2>${locWeather.Temperature.Metric.Value} &deg;${locWeather.Temperature.Metric.Unit}</h2>
                                </div>
                            </div>` + locations.innerHTML;

    /* Save the location in the localstorage */
    let cityNames = JSON.parse(localStorage.getItem("cityNames"));
    if (cityNames === null) cityNames = [];
    if (!cityNames.includes(locDetails.EnglishName)) cityNames.push(locDetails.EnglishName);
    localStorage.setItem("cityNames", JSON.stringify(cityNames));
}

/* Show the cities information the stored locally in the beginning */
(function (){
    let storedCities = localStorage.getItem("cityNames");
    if (storedCities !== null) {
        storedCities = JSON.parse(storedCities);
        if (storedCities !== null && Array.isArray(storedCities)) {
            for (const storedCity of storedCities) {
                api.getCityInfo(storedCity)
                    .then(data => addCity(data))
                    .catch(err => console.log(err));
            }
        }
    }
})();

/* Add the city when user enter a city name */
form.addEventListener("submit", e => {
   e.preventDefault();
   let city = form.location.value.trim();
   form.reset();
   if (city.length) {
       api.getCityInfo(city)
           .then(data => addCity(data))
           .catch(err => console.log(err));
   }
});


/* Make the div scroll horizontally by dragging and moving the mouse */
let scrollingY = false, startX, scrollLeft;
const scrollMouseDown = (e) => {
    scrollingY = true;
    startX = e.pageX - locations.offsetLeft;
    scrollLeft = locations.scrollLeft;
    locations.style.removeProperty("scrollBehavior");
    locations.style.scrollBehavior = ""
    locations.classList.add("active");
}
const scrollMouseUp = () => {
    scrollingY = false;
    locations.style.scrollBehavior = "smooth";
    locations.classList.remove("active");
}
const scrollMouseDownMove = (e) => {
    if(!scrollingY) return;
    e.preventDefault();
    const x = e.pageX - locations.offsetLeft;
    const walk = (x - startX);
    locations.scrollLeft = scrollLeft - walk;
}

/* Make the div scroll horizontally by scrolling the mousewheel */
const scrollWheel = (e) => {
    locations.style.scrollBehavior = "smooth";
    if (e.wheelDelta > 0) {
        locations.scrollLeft -= 250;
    } else {
        locations.scrollLeft += 250;
    }
}
locations.addEventListener("mouseenter", (e) => {
    locations.addEventListener("mousedown", scrollMouseDown);
    locations.addEventListener('mousemove', scrollMouseDownMove);
    locations.addEventListener('mouseup', scrollMouseUp);
    locations.addEventListener("mousewheel", scrollWheel);
});

locations.addEventListener("mouseleave", (e) => {
    locations.removeEventListener("mousedown", scrollMouseDown);
    locations.removeEventListener('mousemove', scrollMouseDownMove);
    locations.removeEventListener('mouseup', scrollMouseUp)
    locations.removeEventListener("mousewheel", scrollWheel);
});