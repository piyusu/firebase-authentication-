# Client (React + Vite)

## Environment variables (.env)
Create `client/.env` with:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_API_BASE_URL=http://localhost:4000/api
```

Values come from your Firebase project settings.

## Install & Run
```
cd client
npm install
npm run dev
```

Open the printed local URL. Use "Sign in with Google" to authenticate, then create/read/update tasks. If your user has the `admin` role, you can delete tasks and assign roles by UID.
