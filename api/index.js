const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../app');

dotenv.config({ path: './config.env' });

let cachedConn = null;
let cachedPromise = null;

const getDbUri = () => {
  if (!process.env.DATABASE) {
    throw new Error('DATABASE env var is required');
  }

  if (process.env.DATABASE.includes('<PASSWORD>') && !process.env.DATABASE_PASSWORD) {
    throw new Error('DATABASE_PASSWORD env var is required when DATABASE contains <PASSWORD>');
  }

  const encodedDbPassword = process.env.DATABASE_PASSWORD
    ? encodeURIComponent(process.env.DATABASE_PASSWORD)
    : '';

  return process.env.DATABASE.includes('<PASSWORD>')
    ? process.env.DATABASE.replace('<PASSWORD>', encodedDbPassword)
    : process.env.DATABASE;
};

const connectDb = async () => {
  if (cachedConn) return cachedConn;

  if (!cachedPromise) {
    const dbUri = getDbUri();
    cachedPromise = mongoose.connect(dbUri).then((m) => m.connection);
  }

  cachedConn = await cachedPromise;
  return cachedConn;
};

module.exports = async (req, res) => {
  try {
    await connectDb();
    return app(req, res);
  } catch (err) {
    console.error('DB connection error:', err.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'error', message: 'Database connection failed' }));
  }
};
