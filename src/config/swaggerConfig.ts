import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Problems and Solutions API",
      version: "1.0.0",
      description:
        "API documentation for Problems and Solutions application",
    },
    servers: [
      {
        url: `${process.env.BASE_URL || "http://localhost:5001"}`,
        description: "Development Server",
      },
    ],
  },
  apis: ["./src/docs/*.yaml"], // Include all YAML files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
