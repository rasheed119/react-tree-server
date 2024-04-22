import express from "express";
import connection from "../../config/DBconfig.js";

const router = express.Router();

router.delete("/delete_selected", (req, res) => {
  const { checkedIds } = req.body;
  const delete_query = checkedIds.map(() => {
    return "DELETE FROM tree WHERE id=?";
  });
  connection.query(delete_query.join(";"), checkedIds, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ Error_msg: "Delete Folder View Selected Error" });
    }
    res.status(204).json({ message: "Successfully Deleted" });
  });
});

export { router as FolderViewOptionsRouter };
