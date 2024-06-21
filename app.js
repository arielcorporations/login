const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const usersFilePath = path.join(__dirname, 'data', 'users.json');

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/signup', (req, res) => {
    const { username, email, dob, password } = req.body;

    // Validate age
    if (!isValidAge(new Date(dob))) {
        return res.json({ message: 'You must be at least 13 years old to sign up.' });
    }

    // Validate password
    if (!isValidPassword(password)) {
        return res.json({ message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.' });
    }

    // Load existing users
    let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    // Check if username already exists
    if (users.find(user => user.username === username)) {
        return res.json({ message: 'Username already exists' });
    }

    // Add new user
    users.push({ username, email, dob, password });
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Load existing users
    let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    // Check if user exists
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.json({ message: 'Login successful' });
    } else {
        res.json({ message: 'Invalid username or password' });
    }
});

function isValidAge(dob) {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age >= 13;
}

function isValidPassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});