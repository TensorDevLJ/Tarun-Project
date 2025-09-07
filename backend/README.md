
# Backend - JNTUGV Certification
- Node/Express backend with registrations, admin auth, PDF certificate generation.
- Run: `npm install` then `npm run dev`
- Seed admin: POST /api/auth/seed (call once)
- Admin login: POST /api/auth/login with {email, password} -> returns JWT
- Protected admin routes require Authorization: Bearer <token>
