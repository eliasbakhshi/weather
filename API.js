class API {
    constructor(){
        this.key = "e8UFoBy9kfJXrYqtvGibQW9wVgX9yM2L";
    }
    async cityWeather(cityCode) {
        const url = "http://dataservice.accuweather.com/currentconditions/v1/";
        const query = `${cityCode}?apikey=${this.key}`;
        try {
            const response = await fetch(url + query);
            const data = await response.json();
            return data[0];
        } catch(err) {
            console.log(err);
        }
    }

    async cityInfo(cityName) {
        const url = "http://dataservice.accuweather.com/locations/v1/cities/search";
        const query = `?q=${cityName}&apikey=${this.key}`;

        try {
            const response = await fetch(url + query);
            const data = await response.json();
            return data[0];
        } catch(err) {
            console.log(err);
        }
    }

    async getCityInfo(city) {
        try {
            const locDetails = await this.cityInfo(city);
            const locWeather = await this.cityWeather(locDetails.Key);
            return {locDetails, locWeather};
        } catch(err) {
            console.log(err);
        }
    }
}
