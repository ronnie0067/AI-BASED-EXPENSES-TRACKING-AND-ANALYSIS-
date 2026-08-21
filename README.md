# AI Expense Tracker & Financial Advisor

I made a stack MERN application that helps you keep track of your daily expenses. It uses Google Gemini AI to give you advice on how to manage your money. The app looks at how you spend your money and gives you a budget limit and a plan to help you stick to it. It has a cool Cyber-Tech glassmorphism UI that is easy to use.

## Key Features

**Multi-User Authentication:** The app has a way for users to register and log in. It uses encrypted passwords to keep your information safe.

**Personalized AI Financial Advisor:** The app uses Google Gemini AI to look at your spending habits and give you advice on how to manage your money. It is like having your personal financial advisor.

**Bulletproof API Handling:** The app can handle a lot of traffic without slowing down. It has a system that helps it recover from errors so you do not have to worry about it crashing.

**Isolated User Databases:** Each user has their private database so you do not have to worry about your information being shared with others.

**Cyber-Tech UI/UX:** The app has a cool UI that is easy to use. It has a background, frosted glass cards and neon colors that make it look like something from a sci-fi movie.

## Pipeline Architecture

```text

[ 1. React Frontend (Vite) ] (Cyber-Tech Glassmorphism UI)

│

▼

[ 2. Security Gateway ] (JWT Verification Middleware)

│

┌────────────┴────────────┐

▼                         ▼

[ 3. MongoDB Layer ]         [ 4. AI Pipeline ]

(Private User Expenses)     (Google Gemini 2.5 Flash)

│                         │

└────────────┬───────────┘

▼

[ 5.. Ai Routine Aggregation ]

│

▼

[ 6. Client Dashboard Render ]

```

## Tech Stack

**Language:** I used JavaScript to build the app with Node.js and React.

**Frontend UI:** I used React 18 and Vanilla CSS3 to make the UI. It has a glassmorphism style. Uses CSS Grid and Flexbox to make it look cool.

**Backend API:** I used Node.js and Express.js to make the backend API.

**Database:** I used MongoDB and Mongoose ODM to store the data.

**Security:** I used JSON Web Tokens and Bcrypt.js to keep the app secure.

**AI Integration:** I used the Google GenAI SDK to integrate the AI into the app.

## Repository Structure

```text

ai-expense-tracker/

├── client/                  # React Frontend (Vite)

│   ├── src/

│   │   ├── App.jsx          # Main application logic & state management

│   │   ├── index.css        # Cyber-tech master stylesheet

│   │   └── main.jsx         # React application entry point

│   ├── package.json         # Frontend dependencies

│   └── vite.config.js       # Vite bundler configuration

├── server/                  # Node.js Backend (Express)

│   ├── server.js            # Main Express API, MongoDB schemas, & AI routes

│   ├── server.env           # Environment variables (Ignored in Git)

│   └── package.json         # Backend dependencies

├──.gitignore               # Security & module exclusion rules

└── README.md                # Project documentation

```

## Installation & Setup

### 1. Clone the Repository

```bash

git clone https://github.com/ronnie0067/MSR-repo.git

cd MSR-repo

```

### 2. Backend Setup

```bash

cd server

npm install

```

Create a `server.env` file in the `server/` directory. Add your secret keys:

```env

PORT=5001

MONGO_URI=mongodb://localhost:27017/ai-expense-tracker

JWT_SECRET=your_super_secret_jwt_key

GEMINI_API_KEY=your_google_gemini_api_key

```

### 3. Frontend Setup

Open a terminal tab and configure the client:

```bash

cd client

npm install

```

## Usage

**Run the Express Backend**

From the `/server` directory:

```bash

npx nodemon server.js

```

*The backend API will run on `http://localhost:5001`.*

**Run the React Frontend**

In a terminal tab (from the `/client` directory):

```bash

npm run dev

```

*The application portal will open at `http://localhost:5173`.*

## API Endpoints

| Method Endpoint | Description |

| --- | --- |

| **POST** | `/api/register` | Creates a new user account with a hashed password |

| **POST** | `/api/login` | Authenticates a user and issues a stateless JWT token |

| **GET** | `/api/expenses` | Retrieves the logged-in users private expense history |

| **POST** | `/api/expenses` | Saves a new categorized expense record to the database |

| **GET** | `/api/expenses/routine` | Analyzes user data, via Gemini AI and returns a JSON budget routine |
