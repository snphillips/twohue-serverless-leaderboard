# twohue-serverless-leaderboard

Backend API for [twohue](https://twohue.netlify.app/), a color-matching game. Built with Netlify Functions and a Neon serverless PostgreSQL database.

## Tech Stack

- **Runtime:** Node.js
- **Functions:** Netlify Serverless Functions
- **Database:** Neon (serverless PostgreSQL)
- **Database client:** node-postgres (`pg`)

## Project Structure

```
twohue-serverless-leaderboard/
├── netlify/
│   └── functions/
│       ├── getPlayers.js
│       ├── getPlayerById.js
│       ├── createPlayer.js
│       ├── updatePlayer.js
│       └── deletePlayer.js
├── db/
│   └── pool.js
├── .env
├── .gitignore
├── netlify.toml
└── package.json
```

## Environment Variables

Create a `.env` file in the root of the project:

```
DATABASE_URL=your_neon_connection_string
```

In production, set `DATABASE_URL` in the Netlify dashboard under **Site configuration → Environment variables**.

## Local Development

Install dependencies:

```bash
npm install
```

Install the Netlify CLI:

```bash
npm install -g netlify-cli
```

Run the dev server:

```bash
netlify dev
```

Functions will be available at `http://localhost:8888/.netlify/functions/`.

## API Endpoints

Base URL (production): `https://your-site-name.netlify.app`

### Get all players
```
GET /.netlify/functions/getPlayers
```
Returns top 10 players ordered by score descending.

**Response `200`:**
```json
[
  { "id": 1, "player": "Elaine", "score": 78 },
  { "id": 2, "player": "Kramer", "score": 48 }
]
```

---

### Get player by ID
```
GET /.netlify/functions/getPlayerById?id=1
```

**Response `200`:**
```json
{ "id": 1, "player": "Elaine", "score": 78 }
```

**Response `404`:**
```json
{ "error": "Player with ID 1 not found" }
```

---

### Create a player
```
POST /.netlify/functions/createPlayer
```

**Request body:**
```json
{ "player": "Newman", "score": 2 }
```

**Response `201`:**
```json
{ "message": "Player added with ID: 7" }
```

---

### Update a player
```
PUT /.netlify/functions/updatePlayer?id=1
```

**Request body:**
```json
{ "player": "Elaine", "score": 99 }
```

**Response `200`:**
```json
{ "message": "Player modified with ID: 1" }
```

**Response `404`:**
```json
{ "error": "Player with ID 1 not found" }
```

---

### Delete a player
```
DELETE /.netlify/functions/deletePlayer?id=1
```

**Response `200`:**
```json
{ "message": "Player deleted with ID: 1" }
```

**Response `404`:**
```json
{ "error": "Player with ID 1 not found" }
```

## Database

The database is hosted on [Neon](https://neon.tech). The table schema is:

```sql
CREATE TABLE twohueleaderboard (
  id     SERIAL PRIMARY KEY,
  player VARCHAR(255) NOT NULL,
  score  INTEGER NOT NULL
);
```

## Deployment

This project is deployed via Netlify's GitHub integration. Pushing to `main` triggers an automatic redeploy.
