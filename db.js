  import mysql from 'mysql2/promise';
    import dotenv from 'dotenv';
    import fs from 'fs';
    const useSSL = process.env.DB_SSL === "true";

    dotenv.config();



    const connection = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        // connectionLimit: 10,
        // queueLimit: 0,
        ssl: false,
    });

    export default connection;