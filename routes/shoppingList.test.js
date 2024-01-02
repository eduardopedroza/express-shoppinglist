const request = require('supertest')
const app = require('../app')
let items = require('../fakeDb')

let popsicle = { name: "popsicle", price: 1.45 };

beforeEach(function () {
  items.push(popsicle);
});

afterEach(function () {
  // Make sure this *mutates*, not redefines, `items`
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [popsicle] });
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: popsicle });
  });
  test("Responds with 404 for invalid item name", async () => {
    const res = await request(app).get(`/items/unknown`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Creating an item", async () => {
    const res = await request(app).post("/items").send({ name: "cheerios", price: 3.40 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ item: { name: "cheerios", price: 3.40 } });
  });
  test("Responds with 400 if name or price is missing", async () => {
    const res = await request(app).post("/items").send({ name: "incompleteItem" });
    expect(res.statusCode).toBe(400);
  });
});

describe("PATCH /items/:name", () => {
  test("Updating an item's details", async () => {
    const res = await request(app).patch(`/items/${popsicle.name}`).send({ name: "new popsicle", price: 2.00 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ 'updated': { name: "new popsicle", price: 2.00 } });
  });
  test("Responds with 404 for invalid item name", async () => {
    const res = await request(app).patch(`/items/unknown`).send({ name: "new name", price: 1.00 });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' });
  });
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/unknown`);
    expect(res.statusCode).toBe(404);
  });
});