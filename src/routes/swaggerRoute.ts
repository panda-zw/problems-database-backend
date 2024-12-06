import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swaggerConfig";

const router = express.Router();

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;