import dotenv from 'dotenv';
import Connection from './dbConnection/dbconnection.js';
import express from 'express';
import cors from 'cors';
import Routes from './routes/tasks.js';

// Configure environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/tasks', Routes);

//DB Connection
Connection()

const port = process.env.PORT || 8001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
