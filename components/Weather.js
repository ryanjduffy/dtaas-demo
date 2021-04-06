import React, { useEffect, useState } from "react";
import format from "date-fns/format";

import Section from "./Section";

import css from "./Weather.module.css";

function useOpenWeather({ apiKey, lat, lon, units = "metric" }) {
  const [apiData, setApiData] = useState(null);

  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setApiData(data);
      });
  }, [apiUrl]);

  return apiData;
}

const icons = {
  Cloudy: "./images/Cloudy_Off.svg",
  Clear: "./images/Sunny_Off.svg",
  Rain: "./images/SunnyRainy_Off.svg",
};

function Weather({ className, lat, lon }) {
  const weather = useOpenWeather({
    apiKey: "fd5ad6f7b2f333673938c00c0479cfb5",
    lat,
    lon,
    units: "imperial",
  });

  return (
    <Section className={className} title="Time and Weather">
      <div className={css.weather}>
        <div className={css.time}>
          <time className={css.currentTime}>
            {format(new Date(), "h:mm aa")}
          </time>
          <time className={css.currentDate}>
            {format(new Date(), "eeee, MMMM do yyyy")}
          </time>
        </div>
        {weather &&
          weather.daily.slice(0, 5).map((d, i) => (
            <div className={css.day} key={`day${i}`}>
              <img
                src={icons[d.weather[0].main] || icons.Clear}
                alt={d.weather[0].main}
              />
              <div>{Math.round(d.temp.max)}&deg;</div>
            </div>
          ))}
      </div>
    </Section>
  );
}

export default Weather;

/*
        // {weather ? (
        //   <div>
        //     <img
        //       src={`http://openweathermap.org/img/w/${apiData.weather[0].icon}.png`}
        //       alt="weather status icon"
        //     />
        //     <br/>
        //     {apiData.name}
        //     <br/>
        //     {apiData.main.temp}&deg; C
        //   </div>
        // ) : (
        //   <h1>Loading</h1>
        // )}
*/
