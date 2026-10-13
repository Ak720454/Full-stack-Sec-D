# Student Records REST API
Node.js + Express, in-memory storage.

## Run
npm install
npm start

Runs on http://localhost:3000

## Endpoints
- POST   /students       { name, email, age } -> 201 / 400 / 409
- GET    /students       optional ?minAge= -> 200
- GET    /students/:id   -> 200 / 404
- DELETE /students/:id   -> 204 / 404
