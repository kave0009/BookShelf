import pkg from "pg";
const { Client } = pkg;

const connectDB = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  console.log("Database connected successfully");
  return client;
};

export { connectDB };

export const query = async (text, params) => {
  const client = await connectDB();
  const result = await client.query(text, params);
  await client.end();
  return result;
};
