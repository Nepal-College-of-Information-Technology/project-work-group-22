// Comprehensive OpenAPI spec for Medic Telemedicine Platform
export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Medic Telemedicine Platform API",
    version: "1.0.0",
    description: "Complete API documentation for Medic - a comprehensive telemedicine platform with doctor verification, appointment booking, video consultations, credit system, and admin management.",
    contact: {
      name: "Medic Support",
      email: "anish.221608@ncit.edu.np"
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    }
  },
  servers: [
    {
      url: "https://your-domain.com",
      description: "Production server"
    },
    {
      url: "http://localhost:3000",
      description: "Development server"
    }
  ],
  security: [
    {
      ClerkAuth: []
    }
  ],
  paths: {
    // Authentication Endpoints
    "/api/auth/sign-in": {
      post: {
        tags: ["Authentication"],
        summary: "User sign in",
        description: "Authenticate user with Clerk",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 }
                },
                required: ["email", "password"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successfully authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" }
              }
            }
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/auth/sign-up": {
      post: {
        tags: ["Authentication"],
        summary: "User sign up",
        description: "Create new user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                  name: { type: "string" }
                },
                required: ["email", "password", "name"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" }
              }
            }
          },
          400: {
            description: "Invalid input data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },

    // User Management Endpoints
    "/api/users/onboarding": {
      post: {
        tags: ["User Management"],
        summary: "Set user role and profile",
        description: "Complete user onboarding by setting role (PATIENT/DOCTOR) and profile information",
        security: [{ ClerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  role: { type: "string", enum: ["PATIENT", "DOCTOR"] },
                  specialty: { type: "string", description: "Required for doctors" },
                  experience: { type: "integer", minimum: 0, description: "Years of experience (doctors only)" },
                  credentialUrl: { type: "string", format: "uri", description: "Credential document URL (doctors only)" },
                  description: { type: "string", description: "Doctor bio (doctors only)" }
                },
                required: ["role"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "User profile updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" }
              }
            }
          },
          400: {
            description: "Invalid input data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/users/profile": {
      get: {
        tags: ["User Management"],
        summary: "Get current user profile",
        description: "Retrieve the authenticated user's complete profile information",
        security: [{ ClerkAuth: [] }],
        responses: {
          200: {
            description: "User profile retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },

    // Doctor Management Endpoints
    "/api/doctors": {
      get: {
        tags: ["Doctor Management"],
        summary: "List doctors by specialty",
        description: "Get all verified doctors, optionally filtered by specialty",
        parameters: [
          {
            name: "specialty",
            in: "query",
            description: "Filter by medical specialty",
            schema: { type: "string" }
          },
          {
            name: "limit",
            in: "query",
            description: "Maximum number of doctors to return",
            schema: { type: "integer", default: 20 }
          },
          {
            name: "offset",
            in: "query",
            description: "Number of doctors to skip",
            schema: { type: "integer", default: 0 }
          }
        ],
        responses: {
          200: {
            description: "List of doctors",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    doctors: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Doctor" }
                    },
                    total: { type: "integer" },
                    hasMore: { type: "boolean" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/doctors/{id}": {
      get: {
        tags: ["Doctor Management"],
        summary: "Get doctor by ID",
        description: "Retrieve detailed information about a specific doctor",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Doctor ID",
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Doctor details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Doctor" }
              }
            }
          },
          404: {
            description: "Doctor not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/doctors/{id}/availability": {
      get: {
        tags: ["Doctor Management"],
        summary: "Get doctor's available time slots",
        description: "Retrieve available appointment slots for the next 4 days",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Doctor ID",
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Available time slots",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    days: {
                      type: "array",
                      items: { $ref: "#/components/schemas/AvailabilityDay" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/doctors/availability": {
      post: {
        tags: ["Doctor Management"],
        summary: "Set doctor availability",
        description: "Set or update doctor's daily availability schedule",
        security: [{ ClerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  startTime: { type: "string", format: "time", description: "Daily start time (HH:MM)" },
                  endTime: { type: "string", format: "time", description: "Daily end time (HH:MM)" }
                },
                required: ["startTime", "endTime"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Availability updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" }
              }
            }
          },
          400: {
            description: "Invalid time range",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },

    // Appointment Management Endpoints
    "/api/appointments": {
      get: {
        tags: ["Appointments"],
        summary: "List appointments",
        description: "Get appointments for the authenticated user (patient or doctor)",
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            description: "Filter by appointment status",
            schema: { 
              type: "string", 
              enum: ["SCHEDULED", "COMPLETED", "CANCELLED"] 
            }
          },
          {
            name: "startDate",
            in: "query",
            description: "Filter appointments from this date",
            schema: { type: "string", format: "date" }
          },
          {
            name: "endDate",
            in: "query",
            description: "Filter appointments until this date",
            schema: { type: "string", format: "date" }
          }
        ],
        responses: {
          200: {
            description: "List of appointments",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    appointments: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Appointment" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Appointments"],
        summary: "Book new appointment",
        description: "Book a new appointment with a doctor (requires 2 credits)",
        security: [{ ClerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  doctorId: { type: "string", description: "Doctor's ID" },
                  startTime: { type: "string", format: "date-time", description: "Appointment start time" },
                  endTime: { type: "string", format: "date-time", description: "Appointment end time" },
                  description: { type: "string", description: "Patient's description of symptoms/concerns" }
                },
                required: ["doctorId", "startTime", "endTime"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "Appointment booked successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    appointment: { $ref: "#/components/schemas/Appointment" }
                  }
                }
              }
            }
          },
          400: {
            description: "Invalid request or insufficient credits",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/appointments/{id}": {
      get: {
        tags: ["Appointments"],
        summary: "Get appointment details",
        description: "Retrieve detailed information about a specific appointment",
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Appointment ID",
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Appointment details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Appointment" }
              }
            }
          },
          404: {
            description: "Appointment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      put: {
        tags: ["Appointments"],
        summary: "Update appointment",
        description: "Update appointment details (notes, status, etc.)",
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Appointment ID",
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  notes: { type: "string", description: "Doctor's notes (doctors only)" },
                  status: { 
                    type: "string", 
                    enum: ["COMPLETED", "CANCELLED"],
                    description: "Update appointment status"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Appointment updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" }
              }
            }
          },
          403: {
            description: "Unauthorized to update this appointment",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Appointments"],
        summary: "Cancel appointment",
        description: "Cancel an appointment (patients and doctors can cancel)",
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Appointment ID",
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Appointment cancelled successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" }
              }
            }
          },
          403: {
            description: "Cannot cancel this appointment",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },

    // Video Call Endpoints
    "/api/video/token": {
      post: {
        tags: ["Video Calls"],
        summary: "Generate video call token",
        description: "Generate Vonage video call token for joining appointment session",
        security: [{ ClerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  appointmentId: { type: "string", description: "Appointment ID" }
                },
                required: ["appointmentId"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Video token generated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    videoSessionId: { type: "string" },
                    token: { type: "string" }
                  }
                }
              }
            }
          },
          400: {
            description: "Invalid appointment or not authorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },

    // Credit System Endpoints
    "/api/credits/balance": {
      get: {
        tags: ["Credit System"],
        summary: "Get user's credit balance",
        description: "Retrieve the current credit balance for the authenticated user",
        security: [{ ClerkAuth: [] }],
        responses: {
          200: {
            description: "Credit balance retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    credits: { type: "integer", description: "Current credit balance" },
                    plan: { type: "string", enum: ["free_user", "standard", "premium"] }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/credits/transactions": {
      get: {
        tags: ["Credit System"],
        summary: "Get credit transaction history",
        description: "Retrieve the user's credit transaction history",
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Maximum number of transactions to return",
            schema: { type: "integer", default: 50 }
          },
          {
            name: "offset",
            in: "query",
            description: "Number of transactions to skip",
            schema: { type: "integer", default: 0 }
          }
        ],
        responses: {
          200: {
            description: "Transaction history retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    transactions: {
                      type: "array",
                      items: { $ref: "#/components/schemas/CreditTransaction" }
                    },
                    total: { type: "integer" }
                  }
                }
              }
            }
          }
        }
      }
    },

    // Payout System Endpoints
    "/api/payouts": {
      get: {
        tags: ["Payout System"],
        summary: "Get doctor's payout history",
        description: "Retrieve payout history for the authenticated doctor",
        security: [{ ClerkAuth: [] }],
        responses: {
          200: {
            description: "Payout history retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    payouts: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Payout" }
                    }
                  }
                }
              }
            }
          },
          403: {
            description: "Only doctors can access payout information",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      post: {
        tags: ["Payout System"],
        summary: "Request payout",
        description: "Request payout for accumulated credits (doctors only)",
        security: [{ ClerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  paypalEmail: { type: "string", format: "email", description: "PayPal email for payout" }
                },
                required: ["paypalEmail"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "Payout request submitted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" }
              }
            }
          },
          400: {
            description: "Invalid request or insufficient credits",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/payouts/earnings": {
      get: {
        tags: ["Payout System"],
        summary: "Get doctor's earnings summary",
        description: "Retrieve earnings summary including completed appointments and available credits",
        security: [{ ClerkAuth: [] }],
        responses: {
          200: {
            description: "Earnings summary retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    earnings: { $ref: "#/components/schemas/EarningsSummary" }
                  }
                }
              }
            }
          }
        }
      }
    },

    // Admin Endpoints
    "/api/admin/doctors/pending": {
      get: {
        tags: ["Admin"],
        summary: "Get pending doctor verifications",
        description: "Retrieve list of doctors awaiting verification (admin only)",
        security: [{ ClerkAuth: [] }],
        responses: {
          200: {
            description: "Pending doctors retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    doctors: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Doctor" }
                    }
                  }
                }
              }
            }
          },
          403: {
            description: "Admin access required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/admin/doctors/{id}/verify": {
      post: {
        tags: ["Admin"],
        summary: "Verify doctor",
        description: "Approve or reject doctor verification (admin only)",
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Doctor ID",
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  status: { 
                    type: "string", 
                    enum: ["VERIFIED", "REJECTED"],
                    description: "Verification decision"
                  }
                },
                required: ["status"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Doctor verification status updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" }
              }
            }
          },
          403: {
            description: "Admin access required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/admin/payouts/pending": {
      get: {
        tags: ["Admin"],
        summary: "Get pending payouts",
        description: "Retrieve list of pending payout requests (admin only)",
        security: [{ ClerkAuth: [] }],
        responses: {
          200: {
            description: "Pending payouts retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    payouts: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Payout" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/admin/payouts/{id}/approve": {
      post: {
        tags: ["Admin"],
        summary: "Approve payout",
        description: "Approve a payout request and deduct credits from doctor (admin only)",
        security: [{ ClerkAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Payout ID",
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Payout approved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" }
              }
            }
          },
          403: {
            description: "Admin access required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },

    // System Endpoints
    "/api/hello": {
      get: {
        tags: ["System"],
        summary: "Health check",
        description: "Simple health check endpoint",
        responses: {
          200: {
            description: "System is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Hello from the API!" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/health": {
      get: {
        tags: ["System"],
        summary: "System health check",
        description: "Comprehensive system health check including database connectivity",
        responses: {
          200: {
            description: "System health status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", enum: ["healthy", "unhealthy"] },
                    timestamp: { type: "string", format: "date-time" },
                    services: {
                      type: "object",
                      properties: {
                        database: { type: "string", enum: ["connected", "disconnected"] },
                        vonage: { type: "string", enum: ["connected", "disconnected"] },
                        clerk: { type: "string", enum: ["connected", "disconnected"] }
                      }
                    }
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
    securitySchemes: {
      ClerkAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Clerk authentication token"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", description: "User ID" },
          clerkUserId: { type: "string", description: "Clerk user ID" },
          email: { type: "string", format: "email" },
          name: { type: "string" },
          imageUrl: { type: "string", format: "uri" },
          role: { 
            type: "string", 
            enum: ["UNASSIGNED", "PATIENT", "DOCTOR", "ADMIN"],
            description: "User role"
          },
          credits: { type: "integer", description: "Credit balance (patients only)" },
          specialty: { type: "string", description: "Medical specialty (doctors only)" },
          experience: { type: "integer", description: "Years of experience (doctors only)" },
          credentialUrl: { type: "string", format: "uri", description: "Credential document URL (doctors only)" },
          description: { type: "string", description: "Doctor bio (doctors only)" },
          verificationStatus: { 
            type: "string", 
            enum: ["PENDING", "VERIFIED", "REJECTED"],
            description: "Verification status (doctors only)"
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "clerkUserId", "email", "role"]
      },
      Doctor: {
        allOf: [
          { $ref: "#/components/schemas/User" },
          {
            type: "object",
            properties: {
              role: { type: "string", enum: ["DOCTOR"] },
              specialty: { type: "string" },
              experience: { type: "integer" },
              credentialUrl: { type: "string", format: "uri" },
              description: { type: "string" },
              verificationStatus: { 
                type: "string", 
                enum: ["PENDING", "VERIFIED", "REJECTED"]
              }
            },
            required: ["specialty", "experience", "verificationStatus"]
          }
        ]
      },
      Patient: {
        allOf: [
          { $ref: "#/components/schemas/User" },
          {
            type: "object",
            properties: {
              role: { type: "string", enum: ["PATIENT"] },
              credits: { type: "integer" }
            },
            required: ["credits"]
          }
        ]
      },
      Appointment: {
        type: "object",
        properties: {
          id: { type: "string" },
          patientId: { type: "string" },
          doctorId: { type: "string" },
          startTime: { type: "string", format: "date-time" },
          endTime: { type: "string", format: "date-time" },
          status: { 
            type: "string", 
            enum: ["SCHEDULED", "COMPLETED", "CANCELLED"]
          },
          notes: { type: "string", description: "Doctor's notes" },
          patientDescription: { type: "string", description: "Patient's description" },
          videoSessionId: { type: "string", description: "Vonage video session ID" },
          videoSessionToken: { type: "string", description: "Vonage video token" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          patient: { $ref: "#/components/schemas/Patient" },
          doctor: { $ref: "#/components/schemas/Doctor" }
        },
        required: ["id", "patientId", "doctorId", "startTime", "endTime", "status"]
      },
      Availability: {
        type: "object",
        properties: {
          id: { type: "string" },
          doctorId: { type: "string" },
          startTime: { type: "string", format: "date-time" },
          endTime: { type: "string", format: "date-time" },
          status: { 
            type: "string", 
            enum: ["AVAILABLE", "BOOKED", "BLOCKED"]
          }
        },
        required: ["id", "doctorId", "startTime", "endTime", "status"]
      },
      AvailabilityDay: {
        type: "object",
        properties: {
          date: { type: "string", format: "date" },
          displayDate: { type: "string", description: "Formatted date for display" },
          slots: {
            type: "array",
            items: {
              type: "object",
              properties: {
                startTime: { type: "string", format: "date-time" },
                endTime: { type: "string", format: "date-time" },
                formatted: { type: "string", description: "Formatted time range" },
                day: { type: "string", description: "Day display name" }
              }
            }
          }
        },
        required: ["date", "displayDate", "slots"]
      },
      CreditTransaction: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          amount: { type: "integer", description: "Positive for additions, negative for deductions" },
          type: { 
            type: "string", 
            enum: ["CREDIT_PURCHASE", "APPOINTMENT_DEDUCTION", "ADMIN_ADJUSTMENT"]
          },
          packageId: { type: "string", description: "Package ID for purchases" },
          createdAt: { type: "string", format: "date-time" }
        },
        required: ["id", "userId", "amount", "type"]
      },
      Payout: {
        type: "object",
        properties: {
          id: { type: "string" },
          doctorId: { type: "string" },
          amount: { type: "number", format: "float", description: "Total payout amount in USD" },
          credits: { type: "integer", description: "Number of credits being paid out" },
          platformFee: { type: "number", format: "float", description: "Platform fee ($2 per credit)" },
          netAmount: { type: "number", format: "float", description: "Net amount to doctor ($8 per credit)" },
          paypalEmail: { type: "string", format: "email", description: "PayPal email for payout" },
          status: { 
            type: "string", 
            enum: ["PROCESSING", "PROCESSED"]
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          processedAt: { type: "string", format: "date-time" },
          processedBy: { type: "string", description: "Admin who processed the payout" },
          doctor: { $ref: "#/components/schemas/Doctor" }
        },
        required: ["id", "doctorId", "amount", "credits", "platformFee", "netAmount", "paypalEmail", "status"]
      },
      EarningsSummary: {
        type: "object",
        properties: {
          totalAppointments: { type: "integer", description: "Total completed appointments" },
          thisMonthAppointments: { type: "integer", description: "This month's completed appointments" },
          availableCredits: { type: "integer", description: "Available credits for payout" },
          totalEarnings: { type: "number", format: "float", description: "Total earnings potential" },
          pendingPayouts: { type: "integer", description: "Number of pending payouts" }
        },
        required: ["totalAppointments", "thisMonthAppointments", "availableCredits", "totalEarnings", "pendingPayouts"]
      },
      AuthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string", description: "JWT token" }
        },
        required: ["success", "user", "token"]
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", description: "Success message" },
          redirect: { type: "string", description: "Redirect URL (optional)" }
        },
        required: ["success"]
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string", description: "Error message" },
          code: { type: "string", description: "Error code" }
        },
        required: ["success", "error"]
      }
    }
  },
  tags: [
    {
      name: "Authentication",
      description: "User authentication and authorization endpoints"
    },
    {
      name: "User Management",
      description: "User profile and onboarding management"
    },
    {
      name: "Doctor Management",
      description: "Doctor-specific operations and availability management"
    },
    {
      name: "Appointments",
      description: "Appointment booking and management"
    },
    {
      name: "Video Calls",
      description: "Video consultation functionality"
    },
    {
      name: "Credit System",
      description: "Credit balance and transaction management"
    },
    {
      name: "Payout System",
      description: "Doctor earnings and payout management"
    },
    {
      name: "Admin",
      description: "Administrative functions for managing the platform"
    },
    {
      name: "System",
      description: "System health and utility endpoints"
    }
  ]
};
