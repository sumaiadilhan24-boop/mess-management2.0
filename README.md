# Mess Management 2.0

A clean, modern, and highly optimized personal application for managing daily meals, deposits, utility bills, and bazar expenses. This project replaces complex Excel spreadsheets with a single, simplified dashboard built with **Next.js**, **Tailwind CSS v4**, and **Supabase**.

---

## 🛠️ Step-by-Step Setup Guide

Follow these steps to set up and run the application locally:

### 1. Database Setup (Supabase)
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. In your project dashboard, navigate to the **SQL Editor** tab from the left sidebar.
3. Click **New Query**, paste the contents of [schema.sql](schema.sql), and click **Run**.
   * *This will create the necessary tables (`messes`, `profiles`, `invites`, `meals`, `deposits`, `costs`), set up row-level security (RLS) policies, and install a trigger to auto-create user profiles upon signup.*

### 2. Configure Environment Variables
1. Copy the template configuration file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Open `.env.local` and fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL (found under Project Settings > API).
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase API Anon Key (found under Project Settings > API).

### 3. Local Installation & Development
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 💡 How it Works & Features

1. **First User (Super Admin)**:
   - The very first user to sign up via the `/signup` page is automatically assigned the `super_admin` role.
   - During signup, they name the mess (e.g. "Valley View Mess").
2. **Invite Members**:
   - The Super Admin can go to the **Members** page and invite new members by entering their email address.
   - This creates a pending invitation and generates a custom registration link (e.g., `/signup?token=xyz`).
3. **Seamless Signup**:
   - The invited member visits the generated link. Their email address is automatically pre-filled and locked.
   - They only need to enter their Full Name and choose a password to join the mess.
4. **Bazar, Utilities & Global Costs**:
   - Members can log meal-related bazar costs (`meal_bazar`), utility bills (wifi, gas, electricity), or global bazar costs in the **Bazar & Costs** section.
5. **Auto-Calculations**:
   - The dashboard dynamically calculates:
     - **Meal Rate** = Total Meal Cost / Total Meal Count.
     - **Utilities Share** = Total Wifi, Gas, Electricity, Global, and Other costs divided equally among all members.
     - **Balance** = Total out-of-pocket spending - Individual Meal Share - Utilities Share.
     - **Status Indicator**: Highlights whether a user needs to pay or will get paid at the end of the month.
