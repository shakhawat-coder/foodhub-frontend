# FoodHub Frontend

> A premium, AI-powered food delivery marketplace built for speed, scalability, and an exceptional user experience.

FoodHub is a state-of-the-art frontend application that connects customers, restaurants, and riders through a seamless, intuitive interface. Leveraging modern technologies like **Next.js**, **Tailwind CSS 4**, and **Framer Motion**, it delivers a high-performance experience with rich animations and professional design.

---

## ✨ Key Features

### 🤖 AI-Powered Intelligence
- **Smart AI Chatbot:** An integrated assistant to help users find meals, track orders, and answer queries in real-time.
- **Hybrid AI Search:** Goes beyond keyword matching—understands intent, corrects typos, and provides dynamic search suggestions.
- **Analytics Insights:** Automated AI-generated business summaries for Providers and Admins to optimize performance.

### 🎭 Multi-Role Experience
- **Customer:** Browse restaurants, search meals with AI, and manage orders with a personal dashboard.
- **Provider (Vendor):** Full-featured dashboard to manage menus, track sales via interactive charts, and process orders.
- **Rider:** Real-time access to available orders, status management, and delivery tracking.
- **Manager & Admin:** High-level platform oversight, user management, and detailed analytics visualization.

### 📊 Advanced Data Visualization
- **Interactive Dashboards:** Visualizing growth, sales trends, and order distributions using **ApexCharts** and **Recharts**.
- **Performance Metrics:** Quick-glance KPIs for vendors and platform admins.

### 🎨 Premium UI/UX
- **Modern Aesthetics:** Built with the latest **Tailwind CSS 4** for a clean, professional look.
- **Smooth Animations:** Powered by **Framer Motion** for polished transitions and interactive micro-animations.
- **Dark Mode Support:** Seamless theme switching for comfortable viewing in any environment.
- **Fully Responsive:** Optimized for everything from small mobile screens to large desktop monitors.

---

## 🔄 Core Workflows

### 🥗 The Customer Journey
1. **Discover:** Search for specific cravings using **Hybrid AI Search** or browse by category.
2. **Order:** Add items to cart and check out using **Cash on Delivery (COD)**.
3. **Engage:** Ask **Foodie AI** (Chatbot) for status updates or meal recommendations based on current menu items.

### 🏪 The Provider Journey
1. **Manage:** Add/Edit meals, manage categories, and set pricing.
2. **Process:** Accept incoming orders and mark them as `PREPARING` once ready.
3. **Analyze:** Use **AI Insights** to understand sales trends and get actionable optimization tips.

### 🏁 The Rider Journey
1. **Availability:** Toggle availability status to see orders ready for pickup.
2. **Delivery:** Accept an order, pick it up from the provider, and deliver it to the customer.
3. **Complete:** Mark orders as `DELIVERED` to finalize the transaction.

---

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Auth:** [Better Auth](https://better-auth.com/) with Google OAuth
- **Forms:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/) & Groq
- **Charts:** [ApexCharts](https://apexcharts.com/) & [Recharts](https://recharts.org/)

---



## ⚙️ Development Setup

### 1. Installation

### 1. Clone the Repository 
```bash
git clone https://github.com/shakhawat-coder/foodhub-frontend.git
cd frontend
```
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file and add:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-8b-instant
```

### 3. Run Development Server
```bash
npm run dev
```

---

## 🛡 Security & Performance

- **Secure Sessions:** Session-based auth with encrypted cookies.
- **Type Safety:** Built entirely with **TypeScript** for robust development.

---


