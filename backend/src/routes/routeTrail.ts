import express from "express";
const router = express.Router();

router.post("/", async function (req, res) {
  const { points } = req.body;

  if (!points || !Array.isArray(points) || points.length < 2) {
    res.status(400).json({ error: "Podaj co najmniej dwa punkty [lat, lng]" });
    return;
  }

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
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      res
        .status(response.status)
        .json({
          error: "Błąd odpowiedzi OpenRouteService",
          details: errorText,
        });
      return;
    }

    const data = await response.json();
    const timeInSeconds = data?.features?.[0]?.properties?.summary?.duration;
    if (timeInSeconds !== undefined) {
      const timeInMinutes = (timeInSeconds / 60).toFixed(1);
      const timeInHours = (timeInSeconds / 3600).toFixed(2);
      console.log(
        `Czas trwania trasy: ${timeInHours} godz, ${timeInMinutes} min`,
      );
    }
    const distanceInMeters = data?.features?.[0]?.properties?.summary?.distance;
    if (distanceInMeters !== undefined) {
      const distanceInKm = (distanceInMeters / 1000).toFixed(2);
      console.log(`Długość trasy: ${distanceInKm} km`);
    } else {
      console.warn("Nie udało się pobrać dystansu z odpowiedzi ORS");
    }

    res.json(data);
  } catch (err) {
    console.error("Błąd ORS:", err);
    res.status(500).json({ error: "Błąd serwera ORS" });
  }
});

export default router;
