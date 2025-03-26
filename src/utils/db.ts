import mariadb from "mariadb";

const createMariaDBConnection = () => {
  const conn = mariadb.createConnection({
    host: "",
    // host: "127.0.0.1",
    user: "",
    password: "",
    database: "",
    connectTimeout: 5000
  });
  return conn;
};

export { createMariaDBConnection };
