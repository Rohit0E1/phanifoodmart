import express from "express";

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.send('API is running!');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;