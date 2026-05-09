import { useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const API_KEY = "c642ffaa3a438064d6ddd47d288c2cb2";
  

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null)
  
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
    setLoading(false)
  };

     const handleKeyDown = (event) => {
  if (event.key === "Enter") {
    getWeather();
  }
};
  
  let bgClass = "default";

  if(weather && weather.weather) {
    const condition = weather.weather[0].main;

    if (condition === "Clear") bgClass = "sunny";
    else if (condition === "Clouds") bgClass = "clouds";
    else if (condition === "Rain") bgClass = "rainy";
    else if (condition === "Thunderstorm") bgClass = "stormy";
  }

 
  return (
    <div className={`app ${bgClass}`}>
      <h1>🌤️ Weather App</h1>

      <input
        type="text"
        placeholder="Escribe una ciudad..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button onClick={getWeather}>Buscar</button>

       {loading && <p className="loading"> ⌛ Cargando clima...</p>}
       {error && <p className="error">{error}</p>}

      {weather && weather.main && (
        <div className="card">
          <h2>{weather.name}</h2>

             <img
      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      alt="clima"
    />

        <h1>{weather.main.temp}°C</h1>

          <p>{weather.weather[0].description}</p>

          <p> 🌪️ viento: {weather.wind.speed} m/s</p>


          <p> 💧 humedad: {weather.main.humidity}%</p>
             

        </div>
      )}
    </div>
  );
}

export default App;