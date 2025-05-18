// const axios = require('axios');

// exports.chatWithOpenAI = async (req, res) => {
//   const userMessage = req.body.message;
//   const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
//   const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

//   if (!userMessage) {
//     return res.status(400).json({ error: 'Message is required.' });
//   }

//   try {
//     const response = await axios.post(
//       OPENAI_API_URL,
//       {
//         model: 'gpt-3.5-turbo',
//         messages: [
//           {
//             role: 'system',
//             content: `
//                     You are a helpful chatbot assistant for the HopeConnect platform.
//                     Only respond with information about:
//                     1. Orphan sponsorship
//                     2. Donations (general fund, education, medical aid)
//                     3. Volunteering and service matching
//                     4. Emergency campaigns
//                     5. Logistics for deliveries
//                     If the user asks something unrelated, say: "I'm sorry, I can only help with HopeConnect-related questions."
//             `,
//           },
//           { role: 'user', content: userMessage }
//         ]
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${OPENAI_API_KEY}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error('OpenAI API error:', error.response?.data || error.message);
//     res.status(500).json({ error: 'Failed to get a response from OpenAI API' });
//   }
// };


const chatWithOpenAI = async (req, res) => {
  console.log('✅ Controller reached');
  return res.json({ message: 'This is a test response from the chatbot.' });
};

module.exports = { chatWithOpenAI };

