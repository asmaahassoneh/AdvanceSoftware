const axios = require('axios');
require('dotenv').config();

const MAPQUEST_API_KEY = process.env.MAPQUEST_API_KEY;

async function getCoordinates(address) {
  const res = await axios.get('http://www.mapquestapi.com/geocoding/v1/address', {
    params: {
      key: MAPQUEST_API_KEY,
      location: address
    }
  });

  const location = res.data.results[0].locations[0].latLng;
  return location;
}

async function getRoute(from, to) {
  const res = await axios.get('http://www.mapquestapi.com/directions/v2/route', {
    params: {
      key: MAPQUEST_API_KEY,
      from: from,
      to: to
    }
  });

  const route = res.data.route;
  return {
    distance: route.distance + ' miles',
    time: (route.time / 60).toFixed(2) + ' mins',
    formattedTime: route.formattedTime,
    legs: route.legs.map(leg => leg.maneuvers.map(step => step.narrative)).flat()
  };
}

module.exports = { getCoordinates, getRoute };
