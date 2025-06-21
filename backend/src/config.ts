interface Config {
  listPerPage: number;
  dbUser: string;
  dbPassword: string;
}

const config: Config = {
  listPerPage: 10,
  dbUser: process.env["DB_USER"] || "postgres",
  dbPassword: process.env["DB_PASS"] || "",
};

export default config;
