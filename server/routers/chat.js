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

router.post('/send', jsonParser, async (req, res) => {
    const { message, language, senderRole, requesterRole, scenario } = req.body;

    var hintString = `I'd like to chat with you in ${language}. `;
    if (senderRole !== null && requesterRole !== null && scenario !== null) {
        hintString += `Assume I'm a ${senderRole}, and you're a ${requesterRole}. We're in a ${scenario}.`;
    }
    var queryString = message;

    // const completion = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: [{"role": "system", "content": hintString}, {"role": "user", "content": queryString}],
    // });

    // var response = completion.data.choices[0].message.content;

    var response = "こんにちわ!";

    res.send({ response: response });
});

router.use(cors());

module.exports = router;