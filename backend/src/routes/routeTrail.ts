import express from "express";
const router = express.Router();

/**
 * @openapi
 * /trailsRoute:
 *   post:
 *     tags:
 *       - TrailsRoute
 *     summary: Create a new trail
 *     description: Create a new trail with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - points
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Trail to the Peak"
 *               description:
 *                 type: string
 *                 example: "A beautiful trail leading to the peak."
 *               points:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
 *                 example: [[37.7749, -122.4194], [37.7849, -122.4094]]
 * responses:
 *       '201':
 *         description: Trail created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Creation success message.
 *                   example: Trail created successfully.
 *       '400':
 *         description: Bad request - missing or invalid data.
 *       '500':
 *         description: Internal server error.
 */

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
      },
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
    const locations = routeCoords.map(([lng, lat]) => ({
      latitude: lat,
      longitude: lng,
    }));

    const elevationResponse = await fetch(
      "https://api.open-elevation.com/api/v1/lookup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locations }),
      },
    );

    if (!elevationResponse.ok) {
      res.json(data);
      return;
    }

    const elevationData = await elevationResponse.json();
    const coordsWithElevation = elevationData.results.map(
      ({ longitude, latitude, elevation }: any) => [
        longitude,
        latitude,
        elevation,
      ],
    );

    data.features[0].geometry.coordinates = coordsWithElevation;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Błąd serwera" });
  }
});

export default router;
