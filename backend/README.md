## OptiCampus Backend (Express + MongoDB)

### Setup

```bash
cd backend
npm install
```

### Environment

Create `backend/.env`:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
```

### Run (local)

```bash
cd backend
npm start
```

Backend runs on `http://localhost:5000`.
