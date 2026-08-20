import { useEffect, useState } from "react";

export function 
useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=17.385&longitude=78.4867&current_weather=true"
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather(data.current_weather);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { weather, loading };
}
