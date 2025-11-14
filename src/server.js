import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
}));

app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/v1', routes);

app.use(notFound);
app.use(errorHandler);

app.get("/_debug/routes", (req, res) => {
  const list = [];
  app._router.stack.forEach((m) => {
    if (m.route && m.route.path) {
      const methods = Object.keys(m.route.methods).filter(Boolean).join(",").toUpperCase();
      list.push({ path: m.route.path, methods });
    }
    if (m.name === "router" && m.handle?.stack) {
      m.handle.stack.forEach((h) => {
        const route = h.route;
        if (route) {
          const methods = Object.keys(route.methods).filter(Boolean).join(",").toUpperCase();
          const base = (m.regexp?.toString().match(/\\\/v1\\\//) ? "/v1" : "");
          list.push({ path: base + route.path, methods });
        }
      });
    }
  });
  res.json(list);
});

connectDB().then(() => {
  app.listen(env.port, () => console.log(` API on http://localhost:${env.port}`));
});
