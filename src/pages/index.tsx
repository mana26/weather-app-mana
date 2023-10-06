import { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/weather.css';


const apiKey = '26f90f84a5d686e3e7a140578118ae71';

const cities = [
    { name: 'Eindhoven' },
    { name: 'London' },
    { name: 'Amsterdam' },
    { name: 'Moscow' },
    { name: 'New York' },
];

const WeatherApp = () => {
    const [selectedCity, setSelectedCity] = useState(cities[0]);
    const [weatherData, setWeatherData] = useState<any>(null);
    const [savedCityData, setSavedCityData] = useState<Record<string, any>>({});

    // Load saved city data from local storage when the component mounts
    useEffect(() => {
        const savedData = localStorage.getItem('cityData');

        if (savedData) {
            setSavedCityData(JSON.parse(savedData));
        }
    }, []);

    const fetchWeatherData = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity.name}&appid=${apiKey}&units=metric`
            );

            const newData = {
                ...savedCityData,
                [selectedCity.name]: response.data,
            };

            setSavedCityData(newData);

            // Save the updated city data in local storage
            localStorage.setItem('cityData', JSON.stringify(newData));

            setWeatherData(response.data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    // Load city data from saved data or fetch if not available
    useEffect(() => {
        if (savedCityData[selectedCity.name]) {
            setWeatherData(savedCityData[selectedCity.name]);
        } else {
            fetchWeatherData();
        }
    }, [selectedCity, savedCityData]);

    return (

        <div className="bg_img">
            <h1>Weather App <span>Powerd by AffilyAds</span></h1>
            <div className="selectcityLabel">
                <label>Select City: </label>
                <select className="selectcity"
                    onChange={(e) =>
                        setSelectedCity(cities.find((city) => city.name === e.target.value) || cities[0])
                    }
                    value={selectedCity.name}
                >
                    {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </div>

            {weatherData && (

                <div className='weatherMainContainer'>
                    <p className="city">{weatherData.name}</p>

                    <p className="temp">{weatherData.main.temp.toFixed()}°C</p>

                    <div className="box_container">

                        <img
                            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                            alt=""
                        />
                        <p className="weatherNm">{weatherData.weather[0].description}</p>

                    </div>
                    <hr />
                    <div className="weatherInnerContainer">
                        <p>Pressure: {weatherData.main.pressure} hPa </p>
                        <p>|</p>
                        <p>Wind: {weatherData.wind.speed} m/s </p>
                        <p>|</p>
                        <p>Feels Like: {weatherData.main.feels_like.toFixed()}°C </p>
                        <p>|</p>
                        <p>Humidity: {weatherData.main.humidity}%</p></div>
                </div>

            )}
        </div>
    );
};

export default WeatherApp;