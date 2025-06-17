import app from "./server";

const port = Number(process.env["PORT"]) || 6868;

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Serwer działa na http://localhost:${port}`);
});
