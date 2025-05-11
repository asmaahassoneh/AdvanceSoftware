require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); 
console.log('API Key:', process.env.HUGGINGFACE_API_KEY);  // For debugging (remove this in production)

const axios = require('axios'); 

const analyzeSentiment = async (text) => {
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
  
      console.log('Full Hugging Face Response:', response.data);  // Log the full response to see what's returned
  
      const predictions = response.data[0];
      if (!predictions) return null;
  
      const top = predictions.reduce((max, current) => current.score > max.score ? current : max);
  
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
      console.error('Sentiment API error:', error.response?.data || error.message);  // Log full error response
      return null;
    }
  };
  

module.exports = { analyzeSentiment };
