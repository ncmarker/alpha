const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
// const PORT = 5001;  // for local dev

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Test route
app.get('/', (req, res) => {
    res.send('Backend is working!!!!');
});


// ROUTES

// Register a new user
app.post('/api/register', async (req, res) => {
    const { username, password, first_name, last_name } = req.body;

    if (!username || !password || !first_name || !last_name) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const { data, error } = await supabase.from('users').insert([
            {
                username,
                password: hashedPassword,
                first_name,
                last_name,
            },
        ])
        .select('*');

        if (error) throw error;

        res.status(201).json({ message: 'User registered successfully', user: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Fetch user from the database
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !data) return res.status(401).json({ error: 'Invalid username or password' });

        // Compare hashed passwords
        const passwordMatch = await bcrypt.compare(password, data.password);
        if (!passwordMatch) return res.status(401).json({ error: 'Invalid username or password' });

        res.status(200).json({ message: 'Login successful', userId: data.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get reminders for a user
app.get('/api/reminders/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const { data, error } = await supabase
            .from('reminders')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a reminder
app.post('/api/reminders', async (req, res) => {
    const { user_id, title, description, due_date } = req.body;

    if (!user_id || !title || !description || !due_date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const { data, error } = await supabase.from('reminders').insert([
            {
                user_id,
                title,
                description,
                due_date,
            },
        ])
        .select('*');

        console.log(data);
        console.log(error);

        if (error) throw error;

        res.status(201).json({ message: 'Reminder added successfully', reminder: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a reminder
app.delete('/api/reminders/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase.from('reminders').delete().eq('id', id).select('*');

        if (error) throw error;

        res.status(200).json({ message: 'Reminder deleted successfully', deleted: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));  // for local dev
module.exports = app;
