import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());

app.post("/user", (req, res) => {
  const { name, pass } = req.body;
  console.log(name, pass);
  res.status(200).json({ message: "succesfull" });
});

app.listen(8080, () => {
  console.log("8080");
});
