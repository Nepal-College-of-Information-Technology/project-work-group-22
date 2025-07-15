// Basic OpenAPI spec for appointments endpoints
export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Appointments API",
    version: "1.0.0",
    description: "API documentation for appointments management."
  },
  paths: {
    "/api/appointments": {
      get: {
        summary: "List all appointments",
        responses: {
          200: {
            description: "A list of appointments",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Appointment" } }
              }
            }
          }
        }
      },
      post: {
        summary: "Create a new appointment",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Appointment" }
            }
          }
        },
        responses: {
          201: {
            description: "Appointment created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Appointment" }
              }
            }
          }
        }
      }
    },
    "/api/appointments/{id}": {
      get: {
        summary: "Get appointment by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: {
            description: "Appointment details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Appointment" }
              }
            }
          }
        }
      },
      put: {
        summary: "Update appointment by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Appointment" }
            }
          }
        },
        responses: {
          200: {
            description: "Appointment updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Appointment" }
              }
            }
          }
        }
      },
      delete: {
        summary: "Delete appointment by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          204: { description: "Appointment deleted" }
        }
      }
    },
    "/api/hello": {
      get: {
        summary: "Simple hello endpoint",
        responses: {
          200: {
            description: "Returns a hello message",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Appointment: {    
        type: "object",
        properties: {
          id: { type: "string" },
          doctor: { type: "string" },
          patient: { type: "string" }
        }
      }
    }
  }
};
