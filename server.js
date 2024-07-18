const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const words = [
    { word: "lion", hint: "This animal is known as the king of the jungle" },
    { word: "peacock", hint: "This is the National bird of India" },
    { word: "newdelhi", hint: "This is the capital of India" },
    { word: "asia", hint: "This is the biggest continent in the world" },
    { word: "edison", hint: "This person invented the light bulb" },
    { word: "three", hint: "This is the number of sides in a triangle" },
    { word: "jupiter", hint: "This is the largest planet in our Solar System" }
];

app.get('/word', (req, res) => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    res.json(randomWord);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
