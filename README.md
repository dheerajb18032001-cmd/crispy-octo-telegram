# Tea Shop — Static Website

This is a simple static website scaffold for a tea shop. It includes pages: Home, Menu, About, Contact, Gallery, and Order (client-side cart using localStorage).

Local preview

If you have Python installed:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Or with Node (serve):

```bash
npx serve .
```

Deployment

- Push this folder to a GitHub repo and connect to Netlify or Vercel for automatic deploys.
- Netlify: drag & drop the folder in Netlify's deploy UI or connect the repo.

What to update next

- Replace `assets/logo.svg` with your logo file.
- Edit `menu.html` to include your full menu (names, descriptions, prices).
- Update contact details in `contact.html` and the Formspree action if you want form handling.

Run with Node.js

If you'd like to serve the site with a minimal Node.js server, from the project root:

```bash
npm install
npm start
```

For development with auto-restart (requires `nodemon`):

```bash
npm install
npm run dev
```

Notes:
- `npm install` will install `express` (and `nodemon` if you want `dev`).

Database (optional):

This project supports PostgreSQL via a single `DATABASE_URL` environment variable (recommended). If `DATABASE_URL` is not provided, the server will attempt to use MySQL env vars (`DB_HOST`, `DB_USER`, `DB_NAME`) as a fallback. If no DB is configured the server uses a local `data/contacts.json` file for persistence.

1. Create a `.env` from `.env.example` and set `DATABASE_URL` or the MySQL variables.

2. Install dependencies (includes `pg`):

```bash
npm install
```

3. Start the server:

```bash
npm start
```

4. Test the contacts endpoints (examples):

POST a contact (replace values):

```bash
curl -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d '{"name":"Alice","email":"a@example.com","message":"Hello"}'
```

GET stored contacts:

```bash
curl http://localhost:3000/api/contacts
```

The server will store/retrieve contacts from Postgres (if `DATABASE_URL`), MySQL (if MySQL vars are present), or `data/contacts.json`.

Deploying the server
--------------------

Quick options to deploy the Express backend:

- Run locally (development):

```bash
npm install
npm run dev
```

- Run in production (local):

```bash
npm install --production
npm start
```

- Docker (build and run locally):

```bash
docker build -t tea-site:latest .
docker run -p 3000:3000 --env PORT=3000 --env-file .env tea-site:latest
```

- Heroku / Render / Railway:

1. Create a Git repo and push this project.
2. On Heroku/Render/Railway, connect the repository and use the default `npm start` command. The included `Procfile` and `Dockerfile` make either container or Node deploy straightforward.

- Firebase hosting: this repo contains `firebase.json` but Firebase Hosting only serves static files. To host the Express server on Google Cloud, use Cloud Run or Cloud Functions and deploy the server directory there.

Environment variables
---------------------

Set `PORT` (optional), and one of the database options:

- `DATABASE_URL` (Postgres) OR
- `DB_HOST`, `DB_USER`, `DB_NAME`, `DB_PASSWORD` (MySQL)

If no DB vars are set the server will persist to `data/contacts.json` and continue to serve the site.
