const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataFilePath = path.join(__dirname, 'data.json');

const readData = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error('Error reading file:', err);
        return [];
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing file:', err);
    }
};

app.post('/api/data', (req, res) => {
    const { id, name, age } = req.body;
    if (!id || !name || !age) {
        return res.status(400).json({ error: 'ID, Name, and Age are required' });
    }

    const data = readData();
    if (data.find(item => item.id === id)) {
        return res.status(400).json({ error: 'ID must be unique' });
    }

    const newData = { id, name, age };
    data.push(newData);
    writeData(data);
    res.status(201).json(newData);
});

app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

app.put('/api/data/:id', (req, res) => {
    const id = req.params.id;
    const { name, age } = req.body;
    if (!name || !age) {
        return res.status(400).json({ error: 'Name and Age are required' });
    }

    let data = readData();
    data = data.map(item => (item.id === id ? { id, name, age } : item));
    writeData(data);
    res.json({ id, name, age });
});

app.delete('/api/data/:id', (req, res) => {
    const id = req.params.id;
    let data = readData();
    data = data.filter(item => item.id !== id);
    writeData(data);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
