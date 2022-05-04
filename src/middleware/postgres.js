const {Pool} =  require('pg');

const connectDB = (handler) => async (req, res) => {
  const pool = new Pool({
    user: "public_readonly",
    host: "testnet.db.explorer.indexer.near.dev",
    database: "testnet_explorer",
    password: "nearprotocol"
  });
  return handler(req, res, pool);
};

export default connectDB;
