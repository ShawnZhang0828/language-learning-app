const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const router = express.Router();
var jsonParser = bodyParser.json()

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/add', jsonParser, async (req, res) => {
    const { word, translation, note, language } = req.body;

    var hintString = "Reply to my question with a number."

    var queryString = `From level 1-6, 1 being beginner level, 5 being expert level and 6 being a word you don't believe is a legit vocabulary.
    *** example, if "good", you should response 1. "dsdfdgfd" should give a 6 since it isn't an english word.
    Estimate the difficulty of ${word}.`

    const completion1 = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{"role": "system", "content": hintString}, {"role": "user", "content": queryString}],
    });
    var level = completion1.data.choices[0].message.content;

    if (level === "6") {
        res.send({ level: level, example: `${word} is invalid!` })
    } else {
        hintString = `Reply with a sentence in ${language}.`;
        queryString = `Create a simple sentence using: ${word}. Give the sentence only.`;

        const completion2 = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{"role": "system", "content": hintString}, {"role": "user", "content": queryString}],
        });
        var example = completion2.data.choices[0].message.content;
    
        res.send({ level: level, example: example });
    }
});

router.use(cors());

module.exports = router;