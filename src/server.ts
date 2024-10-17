// import express from 'express';
// import cors from 'cors';
// import { supabase } from '../supabaseClient'; // Ensure you import your Supabase client
// import userRoutes from './api/routes/userRoutes';  // Users route
// import feedsRoutes from './api/routes/feedsRoutes'
// import notesRoutes from './api/routes/notesRoutes';  // Notes route
// import postsRouter from './api/posts'; // Import posts router

// const app = express();
// const PORT = process.env.PORT || 4000;

// // Middleware
// app.use(cors({
//     origin: 'http://localhost:4000', // Adjust if your frontend runs on a different port
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods if needed
//     credentials: true, // Allow credentials if your requests require them 
// }));
// app.use(express.json());  // To parse JSON request bodies

// // Define a root route
// app.get('/', (req, res) => {
//     res.send('Come let your boobs hang freely!');
// });

// // Use routes
// app.use('/api/users', userRoutes);
// app.use('/api/feeds', feedsRoutes);
// app.use('/api/notes', notesRoutes);
// app.use('/posts', postsRouter); // Using posts router

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// export default { feedsRoutes, notesRoutes, postsRouter  }













import express from 'express';
import cors from 'cors';
import { supabase } from '../supabaseClient'; // Ensure you import your Supabase client
import userRoutes from './api/routes/userRoutes';  // Users route
import feedsRoutes from './api/routes/feedsRoutes'; // Feeds route
import notesRoutes from './api/routes/notesRoutes'; // Notes route
import postsRouter from './api/posts'; // Import posts router

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: ['http://localhost:4000', 'http://localhost:4001'], // Allow both origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    credentials: true, // Allow credentials if your requests require them 
}));
app.use(express.json()); // To parse JSON request bodies

// Define a root route
app.get('/', (req, res) => {
    res.send('Come let your boobs hang freely!');
});

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/feeds', feedsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/posts', postsRouter); // Using posts router


const breastfeedingQuestions = [
    { id: 1, content: 'How often should I breastfeed my baby?', user_id: 1 },
    { id: 2, content: 'What should I do if my baby won’t latch?', user_id: 2 },
    // Add more questions as needed
];

// Endpoint to fetch breastfeeding questions
app.get('/api/breastfeeding-questions', (req, res) => {
    res.json(breastfeedingQuestions);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Export routes if needed (this is optional)
export default { feedsRoutes, notesRoutes, postsRouter };

