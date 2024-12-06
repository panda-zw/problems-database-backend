"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Problems and Solutions API",
            version: "1.0.0",
            description: "API documentation for Problems and Solutions application",
        },
        servers: [
            {
                url: "http://localhost:5001",
                description: "Development Server",
            },
        ],
    },
    apis: ["./src/docs/*.yaml"], // Include all YAML files
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
