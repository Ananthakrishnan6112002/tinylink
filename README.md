🧩 TinyLink — URL Shortener

TinyLink is a simple URL shortener built with Next.js, Prisma, and PostgreSQL (Neon).
It allows users to convert long URLs into short codes and track click statistics.

🚀 Features

Shorten any long URL into a clean short link

Optional custom short code (6–8 characters)

Track click count & last clicked time

Fast redirection using dynamic routes

PostgreSQL database with Prisma ORM

🛠️ Tech Stack
Layer	Technology
Frontend	Next.js
Backend	Next.js API Routes
Database	PostgreSQL (Neon)
ORM	Prisma
Deployment	Vercel (recommended)
🧰 Environment Variables

Create a .env file in the project root:

DATABASE_URL="postgresql://<username>:<password>@<host>/<db_name>?sslmode=require"
BASE_URL="http://localhost:3000"

▶️ Running Locally
npm install
npx prisma migrate dev
npm run dev


App starts at:

http://localhost:3000

📂 Folder Structure
/app
  /api/links       -> REST API for create, list, delete
  /[code]          -> Dynamic redirect route
/lib/prisma.js     -> Prisma DB connection
/prisma/schema.prisma

🖼️ Screenshots

(Optional — add if you want)

🌍 Live Demo

Add your Vercel deployed URL here when ready:

https://your-app.vercel.app

👨‍💻 Author

Feel free to modify:

Made with ❤️ and lots of debugging by A Ananthakrishnan