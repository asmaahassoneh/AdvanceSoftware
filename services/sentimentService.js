require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); 


const axios = require('axios'); 

const analyzeSentiment = async (text) => {
  if (!text || text.trim().length === 0) return { label: 'neutral', confidence: 0 };

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    if (!Array.isArray(response.data) || !Array.isArray(response.data[0])) {
      console.log('Unexpected Hugging Face response format:', response.data);
      return null;
    }

    const predictions = response.data[0];
    const top = predictions.reduce((max, current) =>
      current.score > max.score ? current : max
    );

    let sentimentLabel;
    switch (top.label) {
      case 'LABEL_0':
        sentimentLabel = 'negative';
        break;
      case 'LABEL_1':
        sentimentLabel = 'neutral';
        break;
      case 'LABEL_2':
        sentimentLabel = 'positive';
        break;
      default:
        sentimentLabel = 'unknown';
    }

    return {
      label: sentimentLabel,
      confidence: top.score
    };
  } catch (error) {
    console.error('Sentiment API error:', error.response?.data || error.message);
    return null;
  }
};

  

module.exports = { analyzeSentiment };
