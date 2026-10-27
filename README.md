# Deadline Zero

Deadline Zero is a full-stack academic assignment tracker. Students can create an account, add assignments, track their status and priority, and use a dashboard to focus on upcoming and overdue work.

## Major workflows

- Register, sign in, and sign out using secure HTTP-only cookie sessions.
- Create assignments with a subject, due date, priority, status, and optional description.
- Browse, search, filter, and sort assignments.
- View an assignment, edit it, update its status, or delete it.
- Review a dashboard with completion progress, overdue work, high-priority work, and the nearest upcoming deadlines.

## Technology

- React and Vite client
- Node.js and Express API
- MongoDB and Mongoose
- JWT authentication, bcrypt password hashing, Helmet, rate limiting, and CSRF protection

## Run locally

### Prerequisites

- Node.js 20 or later
- A MongoDB Atlas connection string (or a local MongoDB instance)

### Setup

1. Clone the repository and enter the folder.
2. Install all dependencies:

   ```bash
   npm run install:all
   ```

3. Copy the example environment file to `server/.env` and fill in your own values:

   ```bash
   cp .env.example server/.env
   ```

4. Start the client and API:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173`, register an account, and create an assignment.

## Environment variables

The following values belong in `server/.env`. This file is ignored by Git and must never be committed.

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; defaults to `5000`. |
| `NODE_ENV` | Use `development` locally and `production` when deployed. |
| `MONGODB_URI` | MongoDB connection string. |
| `JWT_SECRET` | Long, randomly generated token-signing secret. |
| `CLIENT_URL` | Allowed client origin, such as `http://localhost:5173`. |
| `COOKIE_SECURE` | Set to `true` when the app is served over HTTPS. |

## Production deployment

The repository includes `render.yaml` for Render. Create a Render Blueprint from this repository, then provide `MONGODB_URI` and `CLIENT_URL` in Render’s environment settings. Render generates `JWT_SECRET` automatically. After the first deployment, update `CLIENT_URL` to the deployed app’s public URL and redeploy.

The server builds the React client and serves it in production. Its health endpoint is available at `/api/health`.

## Demo video link
https://drive.google.com/file/d/1roi3mIr2NrKBIi4kN_BfYGLx-dOlD_tP/view?usp=sharing

## Security notes

- No credentials are stored in this repository.
- `.env` and other environment files are ignored; only a credential-free `.env.example` is committed.
- Authentication passwords are hashed with bcrypt.
- API requests use secure HTTP-only cookies, CSRF checking for state-changing requests, Helmet headers, and rate limiting.
