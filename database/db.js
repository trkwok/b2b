import mysql from 'mysql2/promise';
import 'dotenv/config'
import env from '../utils/validateENV'

const connection = {
    user: env.USER,
    host: env.HOST,
    database: env.DATABASE
};
const pool = mysql.createPool(connection);

export default pool;