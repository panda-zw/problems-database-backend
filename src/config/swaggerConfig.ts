import swaggerJsdoc from "swagger-jsdoc";
import fs from "fs";
import yaml from "yaml";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Path to the YAML file
const yamlFilePath = "./src/docs/swagger.yaml";

// Load and preprocess the YAML file
const yamlContent = fs.readFileSync(yamlFilePath, "utf8");
const parsedYaml = yaml.parse(yamlContent);

// Replace the placeholder with the environment variable
if (process.env.API_BASE_URL) {
  parsedYaml.servers.forEach((server: any) => {
    if (server.url.includes("${API_BASE_URL}")) {
      server.url = server.url.replace("${API_BASE_URL}", process.env.API_BASE_URL);
    }
  });
}

// Save the updated YAML to a temporary file
const updatedYamlFilePath = "./src/docs/swagger-temp.yaml";
fs.writeFileSync(updatedYamlFilePath, yaml.stringify(parsedYaml), "utf8");

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

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
