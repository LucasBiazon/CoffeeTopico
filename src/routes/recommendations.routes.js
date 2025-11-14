import { Router } from 'express';
import { recommendByWeather, recommendByAI } from '../controllers/recommendations.controller.js';

const r = Router();

r.get('/weather', recommendByWeather);
r.post('/ai', recommendByAI);

export default r;
