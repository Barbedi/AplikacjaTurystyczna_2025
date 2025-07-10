import express from "express";
const router = express.Router();

router.post("/", async function (req, res) {
  const { points } = req.body;

  try {
    const response = await fetch(
      "https://api.openrouteservice.org/v2/directions/foot-hiking/geojson",
      {
        method: "POST",
        headers: {
          Authorization: process.env["ORS_API_KEY"] || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: points.map(([lat, lng]: [number, number]) => [lng, lat]),
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      res.status(response.status).json({
        error: "Błąd odpowiedzi OpenRouteService",
        details: errorText,
      });
      return;
    }

    const data = await response.json();

    const routeCoords: number[][] = data.features[0].geometry.coordinates;
    const locations = routeCoords.map(([lng, lat]) => ({ latitude: lat, longitude: lng }));

    const elevationResponse = await fetch("https://api.open-elevation.com/api/v1/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locations }),
    });

    if (!elevationResponse.ok) {
      res.json(data);
      return;
    }

    const elevationData = await elevationResponse.json();
    const coordsWithElevation = elevationData.results.map(
      ({ longitude, latitude, elevation }: any) => [longitude, latitude, elevation]
    );

    data.features[0].geometry.coordinates = coordsWithElevation;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Błąd serwera" });
  }
});

export default router;
