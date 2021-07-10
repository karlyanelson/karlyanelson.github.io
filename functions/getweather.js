const fetch = require("node-fetch");

const handler = async function (event) {
  const LAT_PARAMS = event.queryStringParameters.lat;
  const LON_PARAMS = event.queryStringParameters.lon;
  const UNITS_PARAMS = event.queryStringParameters.units || "I";
  const { WEATHER_BIT_KEY } = process.env;

  try {
    const response = await fetch(
      `http://api.weatherbit.io/v2.0/current?key=${WEATHER_BIT_KEY}&lat=${LAT_PARAMS}&lon=${LON_PARAMS}&units=${UNITS_PARAMS}`
    );
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // output to netlify function log
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

module.exports = { handler };
