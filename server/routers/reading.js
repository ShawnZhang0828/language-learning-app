const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const router = express.Router();
var jsonParser = bodyParser.json();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post("/story", jsonParser, async (req, res) => {
  const { language } = req.body;

  var hintString =
    "Provide the story only. No other text. Start a new line for each paragraph. Minimum 3 paragraphs.";

  var queryString = `Generate a story of around 300-400 words in ${language}.`;

  await sleep(1000);

  const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{"role": "system", "content": hintString}, {"role": "user", "content": queryString}],
  });
  var story = completion.data.choices[0].message.content;

  // var story = `ある日、小さな町で生まれた少女、さくらはとても元気で明るい性格でした。彼女はいつも周りの人々を笑わせ、励ましてくれました。さくらは夢見がちな少女で、いつも街の図書館にいって本を読んでいました。彼女は本の中の世界でさまざまな冒険を楽しむことができました。 ある日、さくらは街にひとりぼっちの猫を見つけました。猫は傷ついていて、とてもかわいそうに見えました。さくらはその猫を家に連れて帰り、優しく世話をしました。やがて猫は元気を取り戻し、さくらと一緒に遊んだり、寝たりするようになりました。 ある夜、さくらは夢の中で不思議な旅に出ることになりました。彼女は猫と一緒に空を飛び、海の底を泳ぎました。彼女は神秘的な森で仲間たちと出会い、一緒に問題を解決しました。さくらは夢の中で成長し、たくさんのことを学びました。 さくらが目覚めると、彼女はまるで新しい人になったようでした。彼女は自分の強さと勇気に気づきました。彼女は町の人々に自分の夢と冒険の話をシェアしました。それを聞いた人々は感銘を受け、さくらを称えました。 その後、さくらは町の図書館で本を読む読書クラブを作りました。彼女は夢を持つ人々をサポートし、共に冒険することを提案しました。さくらの影響で、町の人々は自分たちの夢や目標を追求する勇気を持つようになったのです。 さくらは小さな町に希望と笑顔をもたらし、多くの人々を幸せにしました。彼女の夢と冒険の話は町中に広まり、人々を勇気づけました。さくらは真のヒロインとして称えられ、彼女の物語は語り継がれることになったのでした。`;

  res.send({ story: story });
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.use(cors());

module.exports = router;
