import process from "node:process";
import cors from "cors";
import express from "express";

import "./utils/env";
import routes from "./routes/routes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "../swaggerConfig";

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(cors());

// swagger setup
const swaggerSpecs = swaggerJSDoc(swaggerOptions);
// swagger ui route
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/", routes);

app.listen(PORT, () => {
  console.info(`Server running at ${process.env.API_BASE_URL}`);
});

export default app;
