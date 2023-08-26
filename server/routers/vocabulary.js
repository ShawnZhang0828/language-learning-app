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

    var hintString = "Reply to my question with a number. Example response: '2'"

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
        queryString = `Create a simple sentence using: ${word}. Give the sentence only without translation.`;

        const completion2 = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{"role": "system", "content": hintString}, {"role": "user", "content": queryString}],
        });
        var example = completion2.data.choices[0].message.content;
    
        res.send({ level: level, example: example });
    }
});

router.post('/quiz-feedback', jsonParser, async (req, res) => {
    const { answers, originLanguage, targetLanguage } = req.body;

    var queryString = Object.entries(answers)
                            .map(([key, value]) => `${key} means ${value === "" ? "shit" : value} in ${targetLanguage}`)
                            .join('\n');
    var hintString = `I will provide a statement about translation. The second word (${targetLanguage}) should be a translation of the first word (${originLanguage}).
    For correct translation: 1
    For incorrect translation: 0
    For translations include shit: 0
    Example response:
    1
    1
    0
    0
    Check every line of translations, and put your responses in the questions' order.`

    console.log(queryString)
    const completion1 = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{"role": "system", "content": hintString}, {"role": "user", "content": queryString}],
    });
    var corrections = completion1.data.choices[0].message.content;
    console.log(corrections);

    res.send({ corrections: corrections });
})

router.use(cors());

module.exports = router;