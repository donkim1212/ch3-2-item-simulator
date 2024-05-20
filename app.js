import express from "express";
import dotenv from "dotenv/config";
import dotenvExpand from "dotenv-expand";
import logger from "./middlewares/logger.middleware.js";

const app = express();
const PORT = process.env.PORT || 8081;
dotenvExpand.expand(dotenv);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/", async (req, res, next) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
});
