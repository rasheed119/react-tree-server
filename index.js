import express from "express";
import { treeRouter } from "./DB/Routes/tree_route/tree.js";
import cors from "cors";
import { addroute } from "./DB/Routes/Adddata/adddata.js";
import { FolderViewOptionsRouter } from "./DB/Routes/Folderview/folderviewoptions.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "React Hierarchy" });
});

app.use("/tree", treeRouter);
app.use("/tree/add", addroute);
app.use("/folderview", FolderViewOptionsRouter);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
