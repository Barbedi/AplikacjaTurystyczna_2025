import express from 'express';

const app = express();
const port = parseInt(process.env.PORT || '', 10) || 8080;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen( port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});