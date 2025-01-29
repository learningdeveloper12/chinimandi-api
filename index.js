import express from "express";
import dotenv from "dotenv";
import dbConnection from "./src/utils/dbConnection.js";
import cors from "cors";
import routes from "./src/routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "src/public/uploads")));

const PORT = process.env.PORT || 8080;

dbConnection(process.env.MONGO_URI);

app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`Server Running On: http://localhost:${PORT}`);
});
