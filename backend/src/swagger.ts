import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "HikeUp API",
    version: "1.0.0",
    description: "API for HikeUP",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
