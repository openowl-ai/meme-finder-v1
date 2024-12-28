import express from 'express';
import { setupRoutes } from './routes';
import { initializeDB } from './db';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Initialize routes
setupRoutes(app);

// Start server
const start = async () => {
  try {
    await initializeDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
