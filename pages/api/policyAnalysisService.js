// import axios from 'axios'
// import { apiConf } from './apiConfig'

// const generatePolicyAnalysis = async (policyName, budget, targetGroup, duration, expectedOutcome, retries = 3) => {
//   const prompt = `
//     Analyze the following policy:
//     Policy Name: ${policyName}
//     Budget: ${budget}
//     Target Group: ${targetGroup}
//     Duration: ${duration} years
//     Expected Outcome: ${expectedOutcome}
//   `;

//   try {
//     const response = await axios.post(apiConf.apiUrl, {
//       inputs: prompt,
//     }, {
//       headers: {
//         Authorization: `Bearer ${apiConf.apiKey}`,
//       },
//     });

//     console.log('Hugging Face API Response:', response.data);

//     return response.data[0].generated_text;
//   } catch (error) {
//     // Log more detailed error response
//     if (error.response) {
//       console.error(`Hugging Face API Error Response: ${error.response.data}`);
//       throw new Error(`Hugging Face API Error: ${error.response.data.error || 'Unknown error'}`);
//     } else {
//       console.error('Error making API request:', error.message);
//       throw new Error('Failed to fetch results from Hugging Face API');
//     }
//   }
// };

// export  { generatePolicyAnalysis };

import axios from 'axios';
import { apiConf } from './apiConfig';

const generatePolicyAnalysis = async (policyName, budget, targetGroup, duration, expectedOutcome, retries = 3) => {
  const prompt = `
    Analyze the following policy:
    Policy Name: ${policyName}
    Budget: ${budget}
    Target Group: ${targetGroup}
    Duration: ${duration} years
    Expected Outcome: ${expectedOutcome}
  `.trim();

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.post(apiConf.apiUrl, {
        inputs: prompt,
      }, {
        headers: {
          Authorization: `Bearer ${apiConf.apiKey}`,
        },
      });

      console.log('Hugging Face API Response:', response.data);
      return response.data[0].generated_text;

    } catch (error) {
      // Handle timeout and retry
      if (error.response && error.response.status === 504) {
        console.warn(`Attempt ${attempt + 1} failed: ${error.message}. Retrying in 2 seconds....`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error(`Error: ${error.message}`);
        throw new Error('Failed to fetch results from Hugging Face API');
      }
    }
  }

  throw new Error('Failed to analyze policy after maximum retries');
};

export { generatePolicyAnalysis };
