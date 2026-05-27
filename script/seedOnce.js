require("dotenv").config();
const { exec } = require("child_process");

const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const checkIfSeeded = async () => {
  try {
    await client.connect();
    await client.query('SELECT 1 FROM "user" LIMIT 1;');
    return true;
  } catch (error) {
    if (
      error.message.includes('relation "user" does not exist') ||
      error.message.includes("does not exist")
    ) {
      return false;
    }
    console.error("Unexpected error checking if database is seeded:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

const seedDatabase = () => {
  exec("npm run seed", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error seeding database: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
  });
};

const seedOnce = async () => {
  const isSeeded = await checkIfSeeded();
  if (!isSeeded) {
    console.log("Database is not seeded. Seeding now...");
    seedDatabase();
  } else {
    console.log("Database is already seeded. Skipping seeding.");
  }
};

seedOnce();
