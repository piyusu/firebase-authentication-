# Server (Express + Firebase Admin + MongoDB)

## Environment variables (.env)
Create `server/.env` with:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/firebase_authentication
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Notes:
- Keep the quotes around `FIREBASE_PRIVATE_KEY` and escape newlines as `\n`.
- You can get these values from your Firebase service account JSON.

## Install & Run
```
cd server
npm install
npm run dev
```

The API will listen on `http://localhost:4000`.

## Endpoints
- `GET /health`
- `POST /api/tasks` (admin, user)
- `GET /api/tasks` (admin: all, user: own)
- `PUT /api/tasks/:id` (admin: any, user: own)
- `DELETE /api/tasks/:id` (admin only)
- `GET /api/users/me` (authenticated)
- `POST /api/users/assign-role` (admin only)

## First admin setup
Set a user's custom claims to `{ role: 'admin' }` in Firebase Console or via Admin SDK so you can assign roles to others using the endpoint.
