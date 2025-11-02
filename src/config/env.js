import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: Number(process.env.OPENAI_TEMPERATURE || 0.3),
    maxTokens: Number(process.env.OPENAI_MAX_TOKENS || 600),
  },
  recs: {
    cacheTtlMinutes: Number(process.env.CACHE_TTL_MINUTES || 360),
    maxRecs: Number(process.env.MAX_RECS || 3),
    catalogCandidates: Number(process.env.CATALOG_CANDIDATES || 10),
  }
};

if (!env.mongoUri) throw new Error('MONGO_URI ausente no .env');
if (!env.jwtSecret) throw new Error('JWT_SECRET ausente no .env');
if (!env.openai.apiKey) console.warn('OPENAI_API_KEY não definido — fallback offline será usado.');
