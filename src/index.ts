import express from 'express';
import postsRouter from './api/posts'; // Importing the posts router

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use the posts router for any requests to /posts
app.use('/posts', postsRouter);

const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
