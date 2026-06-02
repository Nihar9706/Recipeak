# 🏔️ Recipeak — Eat With Purpose. Fuel Your Goals.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

> A goal-based food and recipe platform where athletes and fitness enthusiasts discover recipes tailored to their goals and view detailed nutritional breakdowns.

---

## ✨ Features

- **🎯 Goal-Based Discovery** — Browse recipes by fitness goals (Fat Loss, Muscle Building, Maintenance, Wellness) and sports (Swimming, Running, Weightlifting, Cricket, Football, Cycling, Track & Field)
- **📊 Nutrition Breakdown** — Every recipe has calories, protein, carbs, fat, fiber, and sugar with animated donut charts and progress bars vs daily recommended values

- **🔖 Save & Track** — Bookmark favorite recipes and access them from your profile
- **📏 Adjustable Servings** — Scale ingredient quantities with a serving multiplier
- **✅ Interactive Cooking** — Tap-to-cross-off ingredients and steps while cooking
- **🔐 JWT Authentication** — Secure signup/login with httpOnly cookies
- **📱 Fully Responsive** — Mobile-first design, 1→2→3→4 column grid
- **☀️ Warm Pastel Light UI** — Clean, inviting editorial aesthetic with soft pastel tones and Playfair Display typography

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling |
| React Router v7 | Client routing |
| TanStack Query | Data fetching & caching |
| Axios | HTTP client |
| Recharts | Nutrition charts |
| Framer Motion | Animations |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | API server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database |
| JWT + bcrypt | Authentication |
| Zod | Input validation |
| Swagger | API documentation |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Spoonacular API key (free tier: [spoonacular.com](https://spoonacular.com/food-api))


### 1. Clone & Install

```bash
git clone https://github.com/Nihar9706/Recipeak.git
cd Recipeak

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
# Copy example env and fill in your keys
cp server/.env.example server/.env
```

Required environment variables:
```
MONGODB_URI=mongodb://localhost:27017/recipeak
JWT_SECRET=your-secret-key
SPOONACULAR_API_KEY=your-spoonacular-key

CLIENT_URL=http://localhost:5173
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This fetches ~50 recipes from Spoonacular with real nutrition data across all 11 categories. The script is re-runnable and skips duplicates.

### 4. Start Development

```bash
# Terminal 1 — Server
cd server
npm run dev

# Terminal 2 — Client
cd client
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **API Docs:** http://localhost:5000/api-docs

### Docker (Optional)

```bash
docker-compose up --build
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login | No |
| POST | `/api/auth/logout` | Logout | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/categories` | List all categories | No |
| GET | `/api/categories/:id/recipes` | Recipes by category | No |
| GET | `/api/recipes` | List recipes (filtered) | No |
| GET | `/api/recipes/featured` | Featured recipes | No |
| GET | `/api/recipes/:id` | Recipe detail + related | No |
| GET | `/api/users/profile` | User profile | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |
| GET | `/api/users/saved` | Saved recipes | Yes |
| POST | `/api/users/saved/:id` | Save recipe | Yes |
| DELETE | `/api/users/saved/:id` | Unsave recipe | Yes |


Full Swagger docs at `/api-docs` when the server is running.

---

## 📂 Project Structure

```
recipeak/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # ProtectedRoute, etc.
│   │   │   ├── layout/      # Navbar, Footer
│   │   │   └── recipe/      # RecipeCard, CategoryCard, NutritionChart
│   │   ├── pages/           # Route-level pages
│   │   ├── hooks/           # Custom React Query hooks
│   │   ├── store/           # Auth context
│   │   ├── services/        # Axios API calls
│   │   └── types/           # TypeScript interfaces
│   └── Dockerfile
├── server/                  # Express backend
│   ├── src/
│   │   ├── config/          # DB & env config
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/       # Auth, error, validation
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routers

│   │   ├── scripts/         # Seed script
│   │   └── utils/           # ApiError class
│   └── Dockerfile
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#FFFDF7` (Warm Off-White) |
| Card | `#FFFFFF` (White) |
| Primary (Soft Blue) | `#5BA3D9` |
| Secondary (Soft Peach) | `#FFEBCC` |
| Heading Font | Playfair Display |
| Body Font | Inter |
| Mono Font | JetBrains Mono |

---


**Project by [Nihar](https://github.com/Nihar9706)**
