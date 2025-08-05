# 🛍️ Tempify — Launch Temporary Online Stores in Minutes

**Tempify** is a platform that lets creators, small sellers, and hustlers launch *popup online stores* for short bursts — 24 hours, 72 hours, or 1 week. No friction. No subscriptions. Just fast, focused selling.

> 🚀 “Your drop is live. Your store vanishes in 72 hours.”

---

## 🌟 Why Tempify?

- **🎯 One-click store creation**: Zero learning curve for creators who want to launch a merch or digital product drop fast.
- **⏳ Store plans with expiry**: Choose how long your store stays live — urgency = higher conversion.
- **🔗 Shareable storefronts**: Perfect for TikTok bios, WhatsApp, Instagram, and Telegram.
- **🧠 No app, no login for buyers**: Just click → checkout → done.
- **💰 Monetized via Stripe**: Pay to activate stores. Easily scale your commission model.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14+ (App Router)](https://nextjs.org)
- **Styling**: Tailwind CSS + ShadCN UI
- **Auth**: NextAuth.js (JWT strategy)
- **Database**: MongoDB + Mongoose
- **Payments**: **Stripe Checkout**
- **APIs**: RESTful (via Next.js `/app/api/` routes)
- **Utils**: Zod (validation), Sonner (toasts), Axios (API calls), bcryptjs

---

## 💳 Stripe Integration

Tempify uses a **commission-based model**:

- Sellers can launch their store **for free** (within a limited plan).
- On every successful sale, a **platform fee/commission** is deducted via Stripe.
- Commission rate is configurable (e.g. 10% per transaction).
- Stripe handles the split payout using **Stripe Connect** or **application fees**.
- Ideal for: low-friction onboarding + long-term platform revenue.

### Example Workflow

1. User launches a store via `/api/store/create`
2. Adds products and links Stripe account
3. Buyer checks out → Stripe processes the payment
4. Tempify collects its commission automatically
5. Remaining amount is transferred to seller’s Stripe account

## Setup Intructions

# Clone the repo
```js
git clone https://github.com/el-noir/Tempify.git
cd Tempify

# Install dependencies
npm install
``` 

## Environment Variables
```js
MONGODB_URI=
RESEND_API_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
export STRIPE_SECRET_KEY="sk_test_..."                          # Your secret key
export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."        # Used on frontend
export STRIPE_WEBHOOK_SECRET="whsec_..."                        # From Stripe webhook settings
```

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](https://github.com/el-noir/Tempify/blob/master/LICENSE) file for details.


