window.addEventListener("DOMContentLoaded", function () {

    // élements du DOM
    let selectedCity = document.getElementById("whichTown");
    let loadCitiesBtn = document.getElementById("loadTown");

    loadCitiesBtn.addEventListener("click", fetchCities);
    // selectedCity.addEventListener("change", infoWeather);

    // fonctions utilitaires


    // méthode async pour récup les données de la ville
    async function fetchCities() {

        let cities = await City.getJson("http://meteo.webboy.fr/");

        cities.forEach(city => {
            let option = document.createElement("option");
            option.setAttribute("value", city.id);
            let cityName = document.createTextNode(city.name);
            option.appendChild(cityName);
            selectedCity.appendChild(option);
        });

        selectedCity.addEventListener("change", function () {
            getCityData()
        });

        getCityData(cities[0].id)
        loadCitiesBtn.style.color = "grey";
        loadCitiesBtn.disabled = true;
    }

    function getCityData() {
        let id = selectedCity.value;
        city = new City(id);
    }

    // créer la classe city 
    class City {

        // constants pour la connexion à l'API 
        static API_URL = "http://api.openweathermap.org/data/2.5/weather";
        static API_KEY = "af16bc6d476e94f7cb140ea2bf8abe12";
        static API_PARAMS = "&units=metric&lang=fr"
        static METEO_ICON_PATH = 'http://openweathermap.org/img/w/';
        static OTPIONS_DATE = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: '2-digit', minute: '2-digit' };

        //attributs de base
        #id = 0;
        #name = "";
        #icon = "";
        #temperature = 0;
        #wind = 0;
        #windDirection = 0;
        #lat = 0;
        #lon = 0;
        #lastUpdate = "";

        //constructeur
        constructor(id = 0) {
            if (id > 0) {
                this.id = id
                this.infoWeather();
            } else {
                console.error('Erreur de chargement')
            }
        }


        //Getters et setters
        get id() {
            return this.#id;
        }
        set id(_id) {
            this.#id = parseInt(_id)
        }

        get name() {
            return this.#name;
        }

        set name(_name) {
            this.#name = _name
        }

        get icon() {
            return this.#icon;
        }

        set icon(_icon) {
            this.#icon = `${City.METEO_ICON_PATH}${_icon}.png`;
        }

        get temperature() {
            return this.#temperature;
        }

        set temperature(_temp) {
            this.#temperature = _temp;
        }

        get wind() {
            return this.#wind;
        }
        set wind(_wind) {
            this.#wind = _wind;
        }

        get windDirection() {
            return this.#windDirection;
        }
        set windDirection(_windDirection) {
            this.#windDirection = _windDirection;
        }

        get lat() {
            return this.#lat;
        }
        set lat(_lat) {
            this.#lat = _lat;
        }

        get lon() {
            return this.#lon;
        }
        set lon(_lon) {
            this.#lon = _lon;
        }

        get lastUpdate() {
            return this.#lastUpdate;
        }
        set lastUpdate(_lastUpdate) {
            this.#lastUpdate = _lastUpdate;
        }

        /**
         * METHODES
         */
        infoWeather = async () => {
            let weather = document.getElementById("weather");
            weather.classList.replace("hide", "show");

            let url = `${City.API_URL}?id=${this.id}&appid=${City.API_KEY}${City.API_PARAMS}`;
            let cityInfo = await City.getJson(url);
            console.log(cityInfo)

            this.name = cityInfo.name
            this.icon = cityInfo.weather[0].icon;
            this.temperature = cityInfo.main.temp;
            this.wind = cityInfo.wind.speed;
            this.windDirection = cityInfo.wind.deg;
            this.lat = cityInfo.coord.lat;
            this.lon = cityInfo.coord.lon;
            this.lastUpdate = cityInfo.dt;

            let townName = document.getElementById("townLoaded");
            let weatherIcon = document.createElement("img");
            icon.innerHTML = "";
            let temp = document.getElementById("temperature");
            let wind = document.getElementById("windForce");
            let windDirection = document.getElementById("windDirection");
            let coordLat = document.getElementById("coordLat");
            let coordLon = document.getElementById("coordLon");
            let lastReport = document.getElementById("lastReport");

            let latText = this.lat > 0 && this.lat < 90 ? "N" : "S";
            let lonText = this.lon > 0 && this.lon < 180 ? "E" : "O";
            let lastReportTime = new Date(this.lastUpdate * 1000);

            townName.innerHTML = this.name;
            weatherIcon.src = this.icon;
            icon.appendChild(weatherIcon);
            temp.innerHTML = `${Math.floor(this.temperature)} °C`;
            wind.innerHTML = `${Math.floor(this.wind * 3.6)} km/h`;
            windDirection.style.transform = `rotate(${this.windDirection}deg)`;
            coordLat.innerHTML = `${this.lat} ${latText} ,`;
            coordLon.innerHTML = `${this.lon} ${lonText}`;
            lastReport.innerHTML = lastReportTime.toLocaleTimeString("fr-FR", City.OTPIONS_DATE);
            document.getElementById("description").innerHTML = cityInfo.weather[0].description
        }


        static getJson = async (url) => {
            let response = await fetch(url);
            let json = await response.json();
            return json;
        }
    }
});