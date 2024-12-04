const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
// const PORT = 3000;  // for local dev

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

// Register a new user (signup)
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
    const { user_id, title, description, due_date, tag_id } = req.body;

    if (!user_id || !title || !description || !due_date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const reminderData = {
            user_id,
            title,
            description,
            due_date,
        };

        if (tag_id) {
            reminderData.tag_id = tag_id; // Add tag_id if provided
        }

        const { data, error } = await supabase.from('reminders').insert([reminderData]).select('*');

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

// Add a new tag
app.post('/api/tags', async (req, res) => {
    const { name, color } = req.body;
  
    if (!name || !color) {
      return res.status(400).json({ error: 'Name and color are required' });
    }
  
    try {
        const { data, error } = await supabase.from('tags').insert({ name, color }).select('*');

        if (error) throw error;

        res.status(201).json({ message: 'Tag added successfully', tag: data[0] }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong while adding the tag' });
    }
});


// get all tags
app.get('/api/tags', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('tags')
            .select('*');

        if (error) throw error;

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update existing reminder
app.patch('/api/reminders/:reminderId', async (req, res) => {
    const { reminderId } = req.params;
    const { user_id, title, description, due_date, tag, is_complete } = req.body;
  
    const updateData = {};
  
    if (user_id !== undefined) updateData.user_id = user_id;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (due_date !== undefined) updateData.due_date = due_date;
    if (is_complete !== undefined) updateData.is_complete = is_complete;

    console.log("Update Data before tag:", updateData);

    // get the id of the tag that is being added
    if (tag !== undefined) {
        try {
            const { data: tagData, error: tagError } = await supabase
                .from('tags')
                .select('id')
                .eq('name', tag)  
                .single();  

            if (tagError || !tagData) {
                return res.status(400).json({ error: `Tag "${tag}" not found` });
            }

            updateData.tag_id = tagData.id;
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error finding the tag' });
        }
    }

    console.log("Update Data after tag:", updateData);
  
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one field (user_id, title, description, due_date, tag) must be provided for update' });
    }
    
    // update the reminder with new data
    try {
        const { data, error } = await supabase
        .from('reminders')
        .update(updateData)
        .eq('id', reminderId)
        .select('*');

        if (error) throw error;

        if (!data || data.length == 0) {
            return res.status(404).json({ error: 'Reminder not found' });
        }

        res.status(200).json({ message: "tag updated successfully", tag: data[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong while updating the reminder' });
    }
});

// get user info for a specific user 
app.get('/api/users/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId);

        if (error) throw error;

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// update user info for a specific user
app.patch('/api/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const { first_name, last_name, email, goal, monthly_goal } = req.body;
  
    const updateData = {};
  
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (email !== undefined) updateData.email = email;
    if (goal !== undefined) updateData.goal = goal;
    if (monthly_goal !== undefined) updateData.monthly_goal = monthly_goal;

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'At least one field (first_name, last_name, email, goal, monthly_goal) must be provided for update' });
      }

    console.log("Update Data before tag:", updateData);

    try {
        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId)
            .select('*'); // will return updated user

        if (error) {
            return res.status(500).json({ error: 'Error updating user data' });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: `User with id ${userId} not found` });
        }

        res.status(200).json({ message: 'User updated successfully', user: data[0] });
    

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error finding the user' });
    }
});
  

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));  // for local dev
module.exports = app;
