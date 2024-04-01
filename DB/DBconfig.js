import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.password,
  database: "react_tree",
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.log("Error Connecting to DB");
  }
  console.log("Connected to database");
});

export default connection;
