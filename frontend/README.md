# TuckedinPlace

Web platform for quiet-spot discovery (IT342 Project Increment 1: User Accounts and Authentication).

## Tech Stack
- Backend: Spring Boot 4.1.2, Java 17, Spring Security, JWT (jjwt 0.12.6), Spring Data JPA
- Frontend: React (Vite), React Router, Axios
- Database: MySQL

## Implemented Features
1. User account creation: field validation, duplicate-email prevention, BCrypt password hashing, role assignment (USER or OWNER)
2. Login and logout: JWT authentication, error messages for invalid credentials, logout that blacklists the token
3. Role-based dashboards: separate User, Business Owner, and Admin dashboards with role-specific navigation, and role-based access control enforced in both frontend routes and backend endpoints

## Prerequisites
- Java 17+
- Maven (or use the included `mvnw`)
- Node.js (LTS) and npm
- MySQL running on port 3306

## Setup and Run

### 1. Database and backend
1. Make sure MySQL is running. The `tuckedinplace` database is created automatically.
2. Open `backend/src/main/resources/application.properties` and set `spring.datasource.username` and `spring.datasource.password` to your MySQL login.
3. Run `backend.BackendApplication` from IntelliJ, or from the `backend` folder run `./mvnw spring-boot:run`.
4. The API runs at http://localhost:8080.

### 2. Frontend
1. Go to the `frontend` folder.
2. Create a `.env` file containing `VITE_API_URL=http://localhost:8080`.
3. Run `npm install`, then `npm run dev`.
4. Open http://localhost:5173.

## Accounts
- Register new User or Business Owner accounts from the Register page.
- Seeded admin account: `admin@tuckedinplace.com` / `Admin@12345` (admins cannot self-register).

## API Endpoints
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/logout | Authenticated |
| GET | /api/auth/me | Authenticated |
| GET | /api/user/dashboard | USER |
| GET | /api/owner/dashboard | OWNER |
| GET | /api/admin/dashboard | ADMIN |