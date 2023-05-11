import { useEffect, useState } from 'react'
import '../assets/style/app.scss'
import geolocation from '../models/geolocation';
import { CurrentWeather } from '../models/weather';

function Weather() {

  const [isLoading, setIsLoading] = useState(true),
        [ip, setClientIp] = useState<{ ip: string }>(),
        [geolocation, setGeolocation] = useState<geolocation>(),
        [currentWeather, setCurrentWeather] = useState<CurrentWeather>(),
        cached: { 
          timestamp: number,
          ip: { ip: string },
          geolocation: geolocation,
          currentWeather: CurrentWeather
        } = JSON.parse(localStorage.getItem("cache"));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (cached == null || (cached.timestamp + 60000) < new Date().getTime()) {
        await fetchClientIp();
      } else {
        setCurrentWeather(cached.currentWeather);
        setIsLoading(false);
      }
    };
  
    fetchData().catch(console.error);
  }, []);

  async function fetchClientIp() {
    const response = await fetch("https://api.ipify.org/?format=json");
    const data = await response.json();
    await setClientIp(data);
  }
  
  useEffect(() => {
    const fetchGeolocation = async () => {
      if (ip) {
        const response = await fetch("http://ip-api.com/json/"+ ip.ip +"?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query");
        const data = await response.json();
        setGeolocation(data);
      }
    };
  
    fetchGeolocation().catch(console.error);
  }, [ip]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (geolocation) {
        fetch("https://api.openweathermap.org/data/2.5/weather?lat=56.1152&lon=10.0990976&appid=375bfe00b09adf6e74796a4f4443b29e&lang=da&units=metric")
          .then(response => response.json())
          .then((result) => {
            setCurrentWeather(result)
            localStorage.setItem("cache", JSON.stringify({
              "timestamp": new Date().getTime(),
              "ip": ip,
              "geolocation": geolocation,
              "currentWeather": result
            }))
            setIsLoading(false);
          })
          .catch(error => console.log('error', error));
      }
    }

    fetchWeatherData().catch(console.error);
  }, [geolocation])

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className="text-3xl font-bold underline">
      {currentWeather.main.temp}<span>°</span>
      </section>
    </>
  )
}

export default Weather
