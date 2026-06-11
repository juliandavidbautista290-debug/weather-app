import { useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const API_KEY = process.env.REACT_APP_API_KEY;  

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null)
  const [forecast, setForecast] = useState([]);
  const [darkMode, setDarkMode] = useState(
  JSON.parse(localStorage.getItem("darkMode")) || false
);
  const [history, setHistory] = useState(
  JSON.parse(localStorage.getItem("history")) || []
);
  
  const getWeather = async () => {
     console.log("Buscando clima...");

    if (!city) return;

    setLoading(true)

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if  (data.cod !== 200) {
      setError("Ciudad no encontrada ✖️")
      setWeather(null)
      setLoading(false)
      return;
    }

     setWeather(data);

         const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

const forecastResponse = await fetch(forecastUrl);
const forecastData = await forecastResponse.json();

setForecast(forecastData.list.slice(0, 5));

setError(null);

const newHistory = [
  data.name,
  ...history.filter((item) => item !== data.name),
].slice(0, 5);

setHistory(newHistory);
localStorage.setItem("history", JSON.stringify(newHistory));
    setLoading(false)
  };

  const getCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      setWeather(data);
      setError(null);
    },
    () => {
      setError("No se pudo obtener tu ubicación 📍");
    }
  );
};

     const handleKeyDown = (event) => {
  if (event.key === "Enter") {
    getWeather();
  }
};
  
  let bgClass = "default";

  let weatherTip = "";

if (weather && weather.weather) {
  const condition = weather.weather[0].main;

  if (condition === "Clear") {
    weatherTip = "😎 Perfecto para salir a caminar";
  } else if (condition === "Rain") {
    weatherTip = "☔ No olvides tu paraguas";
  } else if (condition === "Clouds") {
    weatherTip = "💻 Un día ideal para programar";
  } else if (condition === "Thunderstorm") {
    weatherTip = "⚠️ Mejor quedarse bajo techo";
  }
}

  if(weather && weather.weather) {
    const condition = weather.weather[0].main;

    if (condition === "Clear") bgClass = "sunny";
    else if (condition === "Clouds") bgClass = "clouds";
    else if (condition === "Rain") bgClass = "rainy";
    else if (condition === "Thunderstorm") bgClass = "stormy";
  }

 
  return (
    <div className={`app ${bgClass} ${darkMode ? "dark" : "light"}`}>
        <h1>🌦️ Weather Vision Pro</h1>

 <button
  className="theme-btn"
  onClick={() => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  }}
>
  {darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
</button>


      <input
        type="text"
        placeholder="Escribe una ciudad..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
      />

        <button onClick={getWeather}>Buscar</button>

<button onClick={getCurrentLocation}>
  📍 Mi ubicación
</button>

       {loading && <p className="loading"> ⌛ Cargando clima...</p>}
       {error && <p className="error">{error}</p>}

       {history.length > 0 && (
  <div className="history">
    <h3>🕒 Últimas búsquedas</h3>

    {history.map((item, index) => (
      <button
        key={index}
        className="history-btn"
       onClick={() => {
  setCity(item);
}}
      >
        {item}
      </button>
    ))}
  </div>
)}

      {weather && weather.main && (
        <div className="card">
          <h2>{weather.name}</h2>

             <img
      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      alt="clima"
    />

        <h1>{weather.main.temp}°C</h1>

          <p>{weather.weather[0].description}</p>

          <p className="weather-tip">
  {weatherTip}
</p>

          <p> 🌪️ viento: {weather.wind.speed} m/s</p>


          <p> 💧 humedad: {weather.main.humidity}%</p>

          <p> 🌡️ Sensación térmica: {weather.main.feels_like}°C</p>

          <p> 👁️ Visibilidad: {(weather.visibility / 1000).toFixed(1)} km</p>

          <p>
  🕒 Hora local:
  {new Date().toLocaleTimeString()}
</p>
             

        </div>
      )}

      {forecast.length > 0 && (
  <div className="forecast">
    <h2>📅 Próximas horas</h2>

    {forecast.map((item, index) => (
      <div key={index} className="forecast-card">
        <p>
          {new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <img
          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
          alt="forecast"
        />

        <p>{Math.round(item.main.temp)}°C</p>
      </div>
    ))}
  </div>
)}
    </div>
  );
}

export default App;