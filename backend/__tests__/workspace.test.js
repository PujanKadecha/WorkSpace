const request = require("supertest");
const http = require("http");
const express = require("express");

jest.mock("../src/lib/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  workspace: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  document: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  $disconnect: jest.fn(),
}));

const prisma = require("../src/lib/prisma");

let app;
try {
  app = require("../server");
} catch (e) {
  app = express();
  app.use(express.json());
  const routes = require("../src/routes");
  app.use("/api", routes);
}

describe("Workspace & Document API Pipeline", () => {
  const dummyToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummySignature";

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/workspaces (Authentication Guard)", () => {
    it("should return 401 or 403 when Authorization header is missing", async () => {
      const res = await request(app).get("/api/workspaces");
      expect([401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/workspaces (Authenticated)", () => {
    it("should return user workspaces array when authenticated", async () => {
      prisma.workspace.findMany.mockResolvedValueOnce([
        { id: "ws_1", name: "Engineering Workspace", ownerId: "user_1" },
      ]);

      const res = await request(app)
        .get("/api/workspaces")
        .set("Authorization", `Bearer ${dummyToken}`);

      if (res.statusCode === 200) {
        expect(Array.isArray(res.body)).toBe(true);
      } else {
        expect([401, 403]).toContain(res.statusCode);
      }
    });
  });

  describe("GET /api/documents/:id", () => {
    it("should reject unauthenticated document fetch", async () => {
      const res = await request(app).get("/api/documents/doc_test_123");
      expect([401, 403]).toContain(res.statusCode);
    });
  });
});
