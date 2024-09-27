import axios from 'axios'
import { apiKey, apiUrl } from './apiConfig'

const generatePolicyAnalysis = async (policyName, budget, targetGroup, duration, expectedOutcome, retries = 3) => {
  const prompt = `
    Analyze the following policy:
    Policy Name: ${policyName}
    Budget: ${budget}
    Target Group: ${targetGroup}
    Duration: ${duration} years
    Expected Outcome: ${expectedOutcome}
  `;

  try {
    const response = await axios.post(apiUrl, {
      inputs: prompt,
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    console.log('Hugging Face API Response:', response.data);

    return response.data[0].generated_text;
  } catch (error) {
    // Log more detailed error response
    if (error.response) {
      console.error(`Hugging Face API Error Response: ${error.response.data}`);
      throw new Error(`Hugging Face API Error: ${error.response.data.error || 'Unknown error'}`);
    } else {
      console.error('Error making API request:', error.message);
      throw new Error('Failed to fetch results from Hugging Face API');
    }
  }
};

module.exports = { generatePolicyAnalysis };