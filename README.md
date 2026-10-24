# CivicPilot AI Frontend

CivicPilot AI is an AI-powered citizen journey interface for discovering government services, viewing personalized journeys, visual guidance, application readiness, and the upcoming Agent phase.

## Frontend stack

- React 19
- Vite 7
- React Router 7
- Axios
- Lucide React
- JavaScript / JSX
- HTML5 / CSS3
- No TypeScript
- No Tailwind

## Architecture

```text
src/
├── App.jsx
├── main.jsx
├── components/
│   ├── common/
│   ├── journey/
│   ├── layout/
│   ├── notifications/
│   └── visual-guidance/
├── context/
├── hooks/
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── journeys/
│   ├── profile/
│   ├── readiness/
│   └── visual-guidance/
├── routes/
├── services/
└── utils/
```

## Run

Make sure the terminal is inside this folder, then:

```bash
npm install
npm run dev
```

The frontend expects the Spring Boot backend at:

```text
http://localhost:8080
```

To use another backend URL, create `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Main user journey

1. Register / Login
2. Dashboard
3. Describe a real-world problem
4. AI problem understanding
5. Government service matching
6. Create a personalized citizen journey
7. Choose:
   - Static visual guidance
   - AI visual guidance
   - Agent journey
8. Application readiness
9. Application tracking and notifications through the backend
10. Future Agent automation
11. SMS integration
12. Cloud / DevOps / monitoring

## Important

The frontend does not invent government requirements or portal URLs. Official links are displayed only when returned by the backend.

AI-generated image URLs use the backend contract already used by CivicPilot:

```text
/ai-generated-images/<filename>.png
```

The database continues to store image URLs rather than image binaries.
