const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

const users = [
  { id: 1, name: "Иван", email: "ivan@example.com" },
  { id: 2, name: "Мария", email: "maria@example.com" },
];

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    // credentials: true
  })
);

app.get("/", (req, res) => {
  res.send("Сервер запущен !");
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
