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

async function getDirections(fromLocation, orphanageId, db) {
  const result = await db.query(
    'SELECT location FROM orphanages WHERE id = $1',
    [orphanageId]
  );
  const rows = result.rows;

  if (!rows.length) {
    throw new Error('Orphanage not found');
  }

  const toLocation = rows[0].location;

  const url = 'http://www.mapquestapi.com/directions/v2/route';
  const params = {
    key: MAPQUEST_API_KEY,
    from: fromLocation,
    to: toLocation,
    unit: 'k' // Use kilometers
  };

  const response = await axios.get(url, { params });

  if (response.data.info.statuscode !== 0) {
    throw new Error('MapQuest API error: ' + response.data.info.messages.join('; '));
  }

  // Extract narratives from all maneuvers in all legs
  const legs = response.data.route.legs;
  const narratives = legs.flatMap(leg =>
    leg.maneuvers.map(maneuver => maneuver.narrative)
  );

  return narratives; // returns array of narrative strings only
}

module.exports = { getCoordinates, getDirections };
