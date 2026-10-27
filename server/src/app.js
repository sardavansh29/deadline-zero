import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientBuildDirectory = path.resolve(sourceDirectory, '../../client/dist');
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '25kb' }));
app.use(cookieParser());
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientBuildDirectory));
  app.get('*', (req, res, next) => (req.path.startsWith('/api/') ? next() : res.sendFile(path.join(clientBuildDirectory, 'index.html'))));
}
app.use(notFound);
app.use(errorHandler);
export default app;
