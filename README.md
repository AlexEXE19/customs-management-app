## Overview

Border control demo consisting of a Spring Boot API (officer auth, passenger checks, risk updates) and a React + TypeScript + Vite frontend with dashboards and exports. The project is split into two folders: `backend` and `frontend`.

## Architecture

- Backend: Spring Boot 4, Java 17, MySQL via Spring Data JPA. REST controllers expose user auth, person lookups, check logging, and risk-level updates. CORS allows the Vite dev host.
- Frontend: React 19 + Vite + TypeScript. Uses axios for API calls, react-router for routing, recharts for charts, jsPDF/XLSX for export, and sessionStorage for lightweight auth state.

## Technology Stack

- Backend: Spring Boot Web, Spring Data JPA (Hibernate), MySQL, Lombok. See [backend/pom.xml](backend/pom.xml).
- Frontend: React 19, Vite 7, TypeScript, axios, react-router-dom, recharts, jsPDF, xlsx. See [frontend/package.json](frontend/package.json).

## Features

- Officer login and registration (`/users/login`, `/users/register`).
- Record a checked person with approval decision and officer ID (`/checked-persons/add`).
- List all checked persons and delete the three oldest entries (`/checked-persons/all`, `/checked-persons/oldest`).
- Update a person risk level (`/persons/{checkedId}/risk`).
- Frontend dashboards: standard dashboard for officers, superintendent dashboard with exports (PDF/XLSX), import, and charts; document check form and history table with filters; risk-level buttons.

## API (backend)

Base URL defaults to `http://localhost:8080` (see [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties)).

- `POST /users/login` — body `{ lastName, password }`; returns officer info on success. See [backend/src/main/java/com/ugal/proiectisi/controller/OfficerController.java](backend/src/main/java/com/ugal/proiectisi/controller/OfficerController.java).
- `POST /users/register` — body `{ firstName, lastName, password, role }`; rejects duplicate last names.
- `GET /checked-persons/all` — returns the full history of checks. See [backend/src/main/java/com/ugal/proiectisi/controller/CheckedPersonController.java](backend/src/main/java/com/ugal/proiectisi/controller/CheckedPersonController.java).
- `POST /checked-persons/add` — query params `personId`, `approved`, `officerId`; creates a checked entry for an existing person.
- `DELETE /checked-persons/oldest` — deletes the three oldest check records.
- `GET /persons/{id}` — fetch a person by ID. See [backend/src/main/java/com/ugal/proiectisi/controller/PersonController.java](backend/src/main/java/com/ugal/proiectisi/controller/PersonController.java).
- `PUT /persons/{checkedId}/risk?riskLevel=<1-3>` — updates the linked person’s risk level using the checked-person ID.

Key entities live under [backend/src/main/java/com/ugal/proiectisi/model](backend/src/main/java/com/ugal/proiectisi/model): `Person` (document details, risk), `CheckedPerson` (decision, officer, timestamp, link to person), `Officer` (credentials, role).

## Frontend flows

- Routing is defined in [frontend/src/App.tsx](frontend/src/App.tsx): root, login, register, dashboard, and superintendent dashboard.
- API base URL is configured in [frontend/src/config/baseUrl.ts](frontend/src/config/baseUrl.ts) and defaults to `http://localhost:8080`.
- Login stores the returned officer in `sessionStorage`; dashboards rely on that object for access control.

## Local setup

Prerequisites: Java 17, Maven 3.9+, Node 20+, npm, MySQL 8 running locally.

1. Database / environment variables

- Create a database and set credentials via a local `.env` file placed in `backend/` (loaded automatically by Spring via `spring.config.import`). All variables are required (no defaults); the app will fail to start if any are missing. Use key=value lines:

  ```env
  DB_HOST=your_host_name
  DB_PORT=3306
  DB_NAME=your_db_name
  DB_USERNAME=your_username
  DB_PASSWORD=your_password
  ```

- Ensure the MySQL user has rights to create/alter tables; `spring.jpa.hibernate.ddl-auto=update` will evolve the schema.

2. Backend

- In `backend`: `./mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`).
- The API listens on `http://localhost:8080`. CORS allows the Vite dev host (see [backend/src/main/java/com/ugal/proiectisi/config/WebConfig.java](backend/src/main/java/com/ugal/proiectisi/config/WebConfig.java)).

Default superintendent account (seeded on first start if missing):

- Last name: `superintendent`
- Password: `supersecret`
- Role: `SUPERINTENDENT`

Use these to log in at `/auth/login`, then create real accounts and change/remove this default in production.

3. Frontend

- In `frontend`: `npm install` then `npm run dev` to start Vite on `http://localhost:5173`.
- Update [frontend/src/config/baseUrl.ts](frontend/src/config/baseUrl.ts) if the backend host/port differs.

4. Login roles

- Officers log in via last name + password. Superintendent-only screens guard access client-side; ensure the officer has role `SUPERINTENDENT` in the database.

## Useful commands

- Backend: `./mvnw test`, `./mvnw spring-boot:run`.
- Frontend: `npm run lint`, `npm run build`, `npm run dev`, `npm run preview`.

## Notes and limitations

- Passwords are stored as plain text; add hashing before production use.
- Auth is sessionStorage-only with no tokens; API is open unless fronted by a gateway.
- `OfficerRepository` uses a `Long` ID type while the entity uses `String`; align if you extend the model.
