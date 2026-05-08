

# QuickGPT 🚀

A **Full-Stack AI Chatbot Application** built with **React.js, Node.js, Express, MongoDB**, powered by **OpenAI** (and optionally **Google Gemini**). QuickGPT lets you chat with AI (text) and generate images (OpenAI DALL·E 2), manage credits, and explore a community gallery — all in a responsive interface.

---

## 🌟 Key Features

- **User Authentication:** Sign up & log in securely (JWT)
- **Text Chat:** AI chat via OpenAI (GPT) or Gemini — one dropdown: **Text (ChatGPT)** | **Image**
- **AI Image Generation:** Create images from prompts using **OpenAI DALL·E 2**, stored on ImageKit
- **Credit System:** 1 credit per text message, 2 per image; purchase via Stripe
- **Community Gallery:** View and share AI-generated images
- **Theme Toggle:** Dark/Light mode
- **Responsive Design:** Mobile and desktop friendly
- **Deployed on Vercel:** Frontend & backend both on Vercel  

---

## 🎨 Preview

![Login Page](client/public/Login.png)
![Signup Page](client/public/signup.png)
![New Chat](client/public/newChat.png)
![Code Generation](client/public/codeGenration.png)
![Image Generation](client/public/imageGenration.png)
![Community Gallery](client/public/CommunityImg.png)
![Price/Credits Page](client/public/price.png)


---

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios, React Hot Toast  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**AI:** OpenAI (chat: GPT-3.5-turbo, image: DALL·E 2) — or Gemini for chat if no OpenAI key  
**Image Storage:** ImageKit (upload generated images)  
**Payments:** Stripe (Checkout + Webhooks)  
**Deployment:** Vercel  



## 🚀 Getting Started

### Prerequisites

- Node.js installed  
- npm or yarn  
- MongoDB (Atlas or local)  
- **OpenAI API key** (for chat + image; or **Gemini API key** for chat only)  
- Stripe API keys (secret + webhook secret)  
- ImageKit account (for storing generated images)  

### Setup

1. **Clone the repository**
```bash
git clone <your_repo_url>
cd <project_directory>
```

2. **Install dependencies**

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

3. **Configure environment variables**

**Server `.env`** (in `server/` folder)

```env
MONGO_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_key
# Optional: use Gemini for chat if OPENAI_API_KEY not set
# GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

- **OpenAI key** → used for both text chat and image generation (DALL·E 2).  
- If you only set **GEMINI_API_KEY**, text chat uses Gemini; **image generation will ask for OpenAI key**.

**Client `.env`** (in `client/` folder) — Vite uses `VITE_` prefix

```env
VITE_SERVER_URL=http://localhost:8000
```

4. **Start the development servers** (use two terminals)

```bash
# Terminal 1 — Backend
cd server
npm run server

# Terminal 2 — Frontend
cd client
npm run dev
```

5. **Access the app**  
   Open [http://localhost:5173](http://localhost:5173)

---

## 📝 Usage

1. **Sign up or log in**
2. **Choose mode** from the dropdown:
   - **Text (ChatGPT)** — AI text chat (OpenAI or Gemini)
   - **Image** — Generate images from prompts (OpenAI DALL·E 2, stored on ImageKit)
3. Type your message and send
4. Use **Community** to view shared images; **Credits** to buy more
5. Toggle **Dark/Light** theme; view or delete chat history from the sidebar

---

## 🌐 Deployment

- **Frontend:** Deploy `client/` to Vercel (build command: `npm run build`, output: `dist`)
- **Backend:** Deploy `server/` to Vercel (Node.js); ensure `vercel.json` and `server.js` export the app
- Set **VITE_SERVER_URL** in frontend env to your backend URL (e.g. `https://quick-gpt-backend-ten.vercel.app`)
- Live demo: [QuickGPT Frontend](https://quick-gpt-frontend-xi.vercel.app)

---

## 📄 License

This project is **open-source**. Fork, customize, and build your own AI chatbot!

---

## 📬 Contact

For queries or contributions, reach out via **shivanipandey0107@gmail.com**

---

**Made with ❤️ and AI magic!**

