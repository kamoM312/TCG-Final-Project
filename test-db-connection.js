// test-db-connection.js
import mysql from "mysql2/promise";

const config = {
  host: "host.docker.internal", // connects to your local machine from inside Docker
  user: "root",
  password: "test",
  database: "dictionaryDB",
  port: 3306,
};

async function testConnection() {
  try {
    console.log("🔄 Attempting to connect to MySQL...");
    const connection = await mysql.createConnection(config);

    // const [rows] = await connection.query('SELECT NOW() AS `current_time`;');
    const [rows] = await connection.query('SELECT * from Users;');
    console.log("✅ Connection successful!");
    // console.log("🕒 Current DB time:", rows[0].current_time);
    console.log(rows);

    await connection.end();
  } catch (err) {
    console.error("❌ Connection failed!");
    console.error("Error message:", err.message);
    console.error("Full error:", err);
  }
}

testConnection();
