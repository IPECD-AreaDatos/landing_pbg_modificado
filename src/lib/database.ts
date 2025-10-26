import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Crear pool de conexiones reutilizable
const pool = mysql.createPool(dbConfig);

export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    console.log('Executing query:', query.substring(0, 100) + '...');
    console.log('With params:', params);
    
    const [rows] = await pool.execute(query, params);
    console.log('Query returned', Array.isArray(rows) ? rows.length : 'non-array', 'rows');
    
    return rows as T[];
  } catch (error) {
    console.error('Database query error details:', {
      error: error instanceof Error ? error.message : error,
      query: query.substring(0, 100) + '...',
      params,
      config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      }
    });
    throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default pool;