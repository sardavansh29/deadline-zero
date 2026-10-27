import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';

const port = Number(process.env.PORT || 5000);
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be configured and at least 32 characters long.');
  process.exit(1);
}
connectDatabase().then(() => app.listen(port, () => console.log(`Deadline Zero API listening on ${port}`))).catch(error => {
  console.error(`MongoDB connection failed: ${error.message}`);
  process.exit(1);
});
