import express, { urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbConnect.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import path from "path";
import cors from "cors";

import helmet from "helmet";
import morgan from "morgan";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

//Config
dbConnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

app.use(helmet());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(express.json({ limit: "30mb" }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

//app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//Routes

app.use("/api/v2/user", userRoutes);

app.use("/api/v2/posts", postRoutes);

//Rendering build folder of the frontend as a static file

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
}

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Listening biatch!");
});
