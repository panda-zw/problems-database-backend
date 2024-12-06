"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Path to the YAML file
const yamlFilePath = "./src/docs/swagger.yaml";
// Load and preprocess the YAML file
const yamlContent = fs_1.default.readFileSync(yamlFilePath, "utf8");
const parsedYaml = yaml_1.default.parse(yamlContent);
// Replace the placeholder with the environment variable
if (process.env.API_BASE_URL) {
    parsedYaml.servers.forEach((server) => {
        if (server.url.includes("${API_BASE_URL}")) {
            server.url = server.url.replace("${API_BASE_URL}", process.env.API_BASE_URL);
        }
    });
}
// Save the updated YAML to a temporary file
const updatedYamlFilePath = "./src/docs/swagger-temp.yaml";
fs_1.default.writeFileSync(updatedYamlFilePath, yaml_1.default.stringify(parsedYaml), "utf8");
// Define swagger-jsdoc options
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Problems and Solutions API",
            version: "1.0.0",
            description: "API documentation for Problems and Solutions application",
        },
        servers: parsedYaml.servers,
    },
    apis: [updatedYamlFilePath], // Use the updated YAML file
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
