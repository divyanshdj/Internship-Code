const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const dataFilePath = path.join(__dirname, 'data.txt');

app.post('/submit', (req, res) => {
    const { username, email, password } = req.body;

    let errors = {};

    if (!username) {
        errors.username = 'Username is required';
    }
    if (!email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Email is invalid';
    }
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }

    if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
    } else {
        const dataToStore = `{\n Username: ${username},\n Email: ${email},\n Password: ${password}\n},\n`;
        fs.appendFile(dataFilePath, dataToStore, () => {
            return res.send('<h1 style="text-align:center">Form submitted successfully!</h1>');
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
