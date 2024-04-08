import express from "express";
import connection from "../../config/DBconfig.js";

const router = express.Router();

router.get("/", (req, res) => {
  const query = "SELECT * FROM tree";
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ Error: "Error executing query" });
    }
    res.status(200).json(result);
  });
});

router.get("/employees", (req, res) => {
  const query = `SELECT * FROM tree where role="E"`;
  connection.query(query, (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing query", err: err.message });
    }
    res.status(200).json({ employees: result });
  });
});
router.get("/admin", (req, res) => {
  const query = `SELECT * FROM tree where role="A"`;
  connection.query(query, (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing query", err: err.message });
    }
    res.status(200).json({ admin: result });
  });
});

router.get("/getemployee/:id", (req, res) => {
  const query = `SELECT * FROM tree where id != ? and role="E"`;
  const { id } = req.params;
  connection.query(query, [id], (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing query", err: err.message });
    }
    if (result[0].role !== "E") {
      return res.status(400).json({ Error: "Only Employee can be Selected" });
    }
    res.status(200).json({ employee: result });
  });
});

router.get("/getmembers/:empid", (req, res) => {
  const empquery = `SELECT * FROM tree WHERE role_id=?`;
  connection.query(empquery, [req.params.empid], (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing query", err: err.message });
    }
    res.status(200).json({ members: result });
  });
});

router.get("/reports_to/:id", (req, res) => {
  const query = `SELECT Name FROM tree WHERE id=?`;
  connection.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing query", err: err.message });
    }
    res.status(200).json({ result });
  });
});

router.get("/htf", (req, res) => {
  const query = "SELECT * FROM tree";
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ Error: "Error executing query" });
    }
    function unflatten(items) {
      var tree = [],
        mappedArr = {};

      items.forEach(function (item) {
        var id = item.id;
        if (!mappedArr.hasOwnProperty(id)) {
          mappedArr[id] = item;
          mappedArr[id].children = [];
        }
      });

      for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
          var mappedElem = mappedArr[id];

          if (mappedElem.role_id) {
            var parentId = mappedElem.role_id;
            mappedArr[parentId].children.push(mappedElem);
          } else {
            tree.push(mappedElem);
          }
        }
      }
      return tree;
    }
    var htf = unflatten(result);
    res.status(200).json(htf);
  });
});

router.delete("/reset_data", (req, res) => {
  const insert_query = `INSERT INTO tree (id, Name, role, role_id)
  VALUES
    (1, 'Super Admin', 'SA',null),
    (2, 'umar', 'A', 1),
    (3, 'mahesh', 'A', 1),
    (4, 'babu', 'A', 1),
    (5, 'ravi', 'A', 1),
    (6, 'david', 'E', 2),
    (7, 'malik', 'E', 3),
    (8, 'abdul', 'E', 4),
    (9, 'nufaiz', 'E', 5),
    (10, 'irfan', 'M', 6),
    (11, 'zaheer', 'M', 6),
    (12, 'ashwin', 'M', 6),
    (13, 'yogi', 'M', 6),
    (14, 'babu', 'M', 7),
    (15, 'ramesh', 'M', 7),
    (16, 'suresh', 'M', 7),
    (17, 'ram', 'M', 7),
    (18, 'akilash', 'M', 8),
    (19, 'Prabhu', 'M', 8),
    (20, 'Raju', 'M', 8),
    (21, 'mohamed', 'M', 8),
    (22, 'sarath', 'M', 9),
    (23, 'vijay', 'M', 9),
    (24, 'ajith', 'M', 9),
    (25, 'suryan', 'M', 9);`;
  const delete_query = `DELETE FROM tree`;
  connection.query(delete_query, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing DELETE query", err: err.message });
    }
    connection.query(insert_query, (err) => {
      if (err) {
        return res
          .status(400)
          .json({ Error: "Error executing INSERT query", err: err.message });
      }
      res.status(204).json({ message: "Data Reset" });
    });
  });
});

//promote Member to Employee route
router.put("/promote_mte", (req, res) => {
  const { member_id, admin_id } = req.body;
  const query = `UPDATE tree SET role_id=?,role=? WHERE id=?`;
  connection.query(query, [admin_id, "E", member_id], (err) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing UPDATE query", err: err.message });
    }
    res.status(204).json({ message: "Employee Promoted" });
  });
});

router.put("/change_employee", (req, res) => {
  const { member_id, employee_id } = req.body;
  const query = `UPDATE tree SET role_id=? WHERE id=?`;
  connection.query(query, [employee_id, member_id], (err) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing UPDATE query", err: err.message });
    }
    res.status(204).json({ message: "Employee Changed" });
  });
});

router.delete("/remove_member/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM tree WHERE id=?`;
  connection.query(query, [id], (err) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing DELETE query", err: err.message });
    }
    res.status(204).json({ message: "Member Removed" });
  });
});

router.put("/peapme/:id", (req, res) => {
  const { id } = req.params;
  const update_employee_to_admin_query = `UPDATE tree SET role=?,role_id=? WHERE id=?`;
  const update_member_to_employee_query = `UPDATE tree SET role=? where role_id=?`;
  connection.query(update_employee_to_admin_query, ["A", 1, id], (err) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing UPDATE query", err: err.message });
    }
    connection.query(update_member_to_employee_query, ["E", id], (err) => {
      if (err) {
        return res
          .status(400)
          .json({ Error: "Error executing UPDATE query", err: err.message });
      }
      res.status(204).json({ message: "Employee Promoted" });
    });
  });
});

router.put("/padpa/:id", (req, res) => {
  const { id } = req.params;
  const { role_id } = req.body;
  const query = `UPDATE tree SET role=?,role_id=? WHERE id=?`;
  connection.query(query, ["A", 1, id], (err) => {
    if (err) {
      return res
        .status(400)
        .json({ Error: "Error executing UPDATE query", err: err.message });
    }
    connection.query(
      "SELECT id from tree where role_id=?",
      [id],
      (err, result) => {
        if (err) {
          return res.status(400).json({
            Error: "Error executing UPDATE query",
            err: err.message,
          });
        }
        if (result.length > 0) {
          var str_query = result.map((item) => {
            return `UPDATE tree SET role_id=${role_id} WHERE id=${item.id}`;
          });
          connection.query(str_query.join(";"), (err, result) => {
            if (err) {
              return res.status(400).json({
                Error: "Error executing UPDATE query",
                err: err.message,
              });
            }
          });
        }
      }
    );
    connection.query(query, ["E", id, role_id], (err) => {
      if (err) {
        return res.status(400).json({
          Error: "Error executing UPDATE query",
          err: err.message,
        });
      }
      res.status(200).json({ message: "Employee Promoted" });
    });
  });
});

router.put("/dmpme/:id", (req, res) => {
  const { id } = req.params;
  const { member_id, role_id } = req.body;
  const query = `UPDATE tree SET role_id=?,role=? WHERE id=?`;
  const select_query = `SELECT id FROM tree WHERE role_id=?`;
  connection.query(query, [role_id, "E", member_id], (err, result) => {
    if (err) {
      return res.status(400).json({
        Error: "Error executing UPDATE query",
        err: err.message,
      });
    }
    connection.query(select_query, [id], (err, result) => {
      if (err) {
        return res.status(400).json({
          Error: "Error executing UPDATE query",
          err: err.message,
        });
      }
      if (result.length > 0) {
        const map_query = result.map((item) => {
          return `UPDATE tree SET role_id=${member_id} WHERE id=${item.id}`;
        });
        connection.query(map_query.join(";"), (err, result) => {
          if (err) {
            return res.status(400).json({
              Error: "Error executing UPDATE query",
              err: err.message,
            });
          }
        });
      }
    });
    connection.query(query, [member_id, "M", id], (err, result) => {
      if (err) {
        return res.status(400).json({
          Error: "Error executing UPDATE query",
          err: err.message,
        });
      }
      res.status(204).json({ message: "Member Promoted Employee Depromoted" });
    });
  });
});

router.put("/pamme/:id", (req, res) => {
  const { id } = req.params;
  const update_query = `UPDATE tree SET role_id=?,role=? WHERE id=?`;
  if (Object.keys(req.body).length > 0) {
    const query = Object.keys(req.body).map(() => {
      return `UPDATE tree SET role_id=? WHERE id=?`;
    });
    const dep = [];
    for (const key in req.body) {
      dep.push(req.body[key]);
      dep.push(key);
    }
    connection.query(query.join(";"), dep, (err) => {
      if (err) {
        return res.status(400).json({
          Error: "Error executing UPDATE query",
          err: err.message,
        });
      }
    });
  }
  connection.query(update_query, [1, "A", id], (err) => {
    if (err) {
      return res.status(400).json({
        Error: "Error executing UPDATE query",
        err: err.message,
      });
    }
    res.status(204).json({ message: "Employee Promoted" });
  });
});

router.delete("/deleteemp/:empid", (req, res) => {
  const { empid } = req.params;
  if (Object.keys(req.body).length === 0) {
    const query = `DELETE FROM tree WHERE id=?`;
    connection.query(query, [empid], (err) => {
      if (err) {
        return res
          .status(400)
          .json({ Error: "Error executing DELETE query", err: err.message });
      }
      res.status(204).json({ message: "Employee Deleted" });
    });
  } else {
    const dep = [];
    for (const key in req.body) {
      dep.push(req.body[key]);
      dep.push(key);
    }
    const query = Object.keys(req.body).map((str) => {
      return `UPDATE tree SET role_id=? WHERE id=?`;
    });
    const delete_query = `DELETE FROM tree WHERE id=?`;
    connection.query(query.join(";"), dep, (err) => {
      if (err) {
        return res
          .status(400)
          .json({ Error: "Error executing UPDATE query", err: err.message });
      }
      connection.query(delete_query, [empid], (err) => {
        if (err) {
          return res
            .status(400)
            .json({ Error: "Error executing DELETE query", err: err.message });
        }
        res.status(204).json({ message: "Employee Deleted" });
      });
    });
  }
});

export { router as treeRouter };
