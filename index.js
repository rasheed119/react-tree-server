import express from "express";
import { treeRouter } from "./DB/Routes/tree.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "React Hierarchy" });
});

app.use("/tree", treeRouter);

app.listen(8080, () => {
  console.log("Server is running on port 3000");
});
