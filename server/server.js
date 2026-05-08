import "dotenv/config";  

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import UserRouter from './router/User.Routes.js';
import ChatRouter from './router/Chat.Route.js';
import messageRouter from "./router/Message.Route.js";
import creditRouter from "./router/Credits.Route.js";
import { stripeWebhooks } from "./controllers/webHook.Controller.js";
import path from 'path';

const app = express();

// CORS: allow frontend origin and required headers (fixes OPTIONS + POST body on Vercel)
const allowedOrigins = [
  'https://quick-gpt-frontend-xi.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  /\.vercel\.app$/
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // same-origin or Postman
    if (allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) return cb(null, true);
    return cb(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Body parsing: read raw stream once so body never lost (helps on Vercel serverless)
app.use((req, res, next) => {
  if (req.path === '/api/stripe') return next(); // Stripe needs raw body
  const isJson = req.headers['content-type']?.includes('application/json');
  if ((req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'PATCH') || !isJson) {
    req.body = req.body || {};
    return next();
  }
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    try {
      const raw = Buffer.concat(chunks).toString('utf8');
      req.body = raw ? JSON.parse(raw) : {};
    } catch (_) {
      req.body = {};
    }
    next();
  });
  req.on('error', (err) => {
    req.body = {};
    next(err);
  });
});
app.use(express.static(path.join(process.cwd(), 'client/public')));


//connecting to db
await connectDB();

//Stripe webhooks
app.post('/api/stripe',express.raw({type:'application/json'}),stripeWebhooks)

//routes
app.use('/api/user',UserRouter)
app.use('/api/chat',ChatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credits',creditRouter)

//health-check route
app.get('/', (req, res) => res.send("well - health..."))

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client/public', 'favicon.ico'));
  });
  

// Local server (Vercel uses the exported app)
const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log('Server is live on', PORT));
}

export default app;