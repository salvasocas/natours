const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../app');

dotenv.config({ path: './config.env' });

let cachedConn = null;
let cachedPromise = null;

const classifyDbError = (err) => {
  const msg = (err && err.message) || '';

  if (msg.includes('DATABASE env var is required')) return 'missing_database_env';
  if (msg.includes('DATABASE_PASSWORD env var is required')) return 'missing_database_password_env';
  if (msg.includes('querySrv ENOTFOUND') || msg.includes('ENOTFOUND')) return 'atlas_host_not_found';
  if (msg.includes('Authentication failed')) return 'atlas_auth_failed';
  if (msg.includes('IP') || msg.includes('whitelist')) return 'atlas_ip_not_whitelisted';
  if (msg.includes('Server selection timed out')) return 'atlas_server_selection_timeout';

  return 'db_connection_error';
};

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
    cachedPromise = mongoose
      .connect(dbUri, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => m.connection);
  }

  cachedConn = await cachedPromise;
  return cachedConn;
};

module.exports = async (req, res) => {
  try {
    await connectDb();
    return app(req, res);
  } catch (err) {
    const errorCode = classifyDbError(err);
    console.error('DB connection error:', err.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        status: 'error',
        message: 'Database connection failed',
        errorCode,
      })
    );
  }
};
