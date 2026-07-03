# Mess Management 2.0 🚀

A clean, modern, and highly optimized personal application for managing daily meals, deposits, utility bills, and bazar expenses. This project replaces complex Excel spreadsheets with a single, simplified dashboard built with **Next.js**, **Tailwind CSS v4**, and **Supabase**.

---

## 🛠️ Step-by-Step Setup Guide

Follow these steps to set up and run the application:

### 1. Database Setup (Supabase)
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. In your project dashboard, navigate to the **SQL Editor** tab from the left sidebar.
3. Click **New Query**, paste the contents of [schema.sql](schema.sql), and click **Run**.
   * *This will create the necessary tables (`messes`, `profiles`, `invites`, `meals`, `deposits`, `costs`), set up row-level security (RLS) policies, and configure triggers to auto-create user profiles upon signup.*

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
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Going Live (Production Deployment)

### Deploying the Frontend (Vercel)
1. Push your code repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com/) and import your repository.
3. In the project setup, add the two environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will automatically build and publish your Next.js application.

### Configuring Supabase Auth for Live Users
1. **Redirect URLs**:
   * In Supabase Dashboard, go to **Authentication** > **URL Configuration**.
   * Set the **Site URL** to your live production URL (e.g. `https://your-mess-app.vercel.app`).
2. **Email OTP Setup / Fast Onboarding**:
   * By default, Supabase requires email verification.
   * If you want members to log in instantly without waiting for verification emails, go to **Authentication** > **Providers** > **Email** and toggle **Confirm email** to **OFF** (only recommended for closed private groups/messes).
   * For production-grade email verification, configure a custom SMTP service (like SendGrid or Resend) under the **SMTP** settings tab.

---

## 💡 Advanced Features & Core Customizations

### 1. Deposit & Contribution Models
Managed under **Settings > General Config**, the application supports two financial models:
* **Prepaid Model (Traditional)**: Members deposit cash in advance to a central fund/manager. 
  * *Net Balance = (Deposited + Your Out-of-pocket Spending) - Cost Share*
* **Pay-as-you-go Model (Direct Spending)**: No separate deposits are made. Out-of-pocket purchases count directly as a member's deposit contribution. The "Deposits" navigation menu is automatically hidden to keep the UI clean.
  * *Net Balance = Your Out-of-pocket Spending - Cost Share*

### 2. Meal Logging Rules
Configure who can log daily meals in **Settings**:
* **Anyone**: Any logged-in member can log meals for any other member.
* **Each member logs for themselves only**: Members can only see and log meals for their own profile. (Super Admins retain override access to log for everyone).
* **Only Super Admins**: Restricts all logs exclusively to the manager.

### 3. Custom Cost Splits
When logging utility bills or bazar purchases under **Bazar & Costs**:
* Untick **Share with all members** to open split parameters.
* Select only the specific members who consume/share that transaction.
* Toggle **Enable custom shares** to enter precise custom Taka values per member (e.g., if one member consumes 500 TK and another 1000 TK) instead of equal division.

### 4. Symmetrical Calendar Tracker
Located on the main **Summary** page, the color-coded calendar grid shows an instant monthly overview of logging compliance:
* 🟢 **Light Green BG**: Date is in the past (or is today) and meal counts are logged.
* 🔴 **Light Red BG**: Date is in the past (or today) but meal counts are missing.
* ⚫ **Muted Gray BG**: Date is in the future.

### 5. Auto-Recovery & Profiles Integrity
* If the tables are wiped or database schema is reset, the layout automatically recreates a new `profiles` row matching the active authenticated Supabase session on the fly. This prevents login locks or infinite redirect loops.
* Signup invitation tokens expire automatically after 30 days.
