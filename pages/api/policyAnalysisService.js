const axios = require('axios');
const { apiKey, apiUrl } = require('../config/apiConfig');

const generatePolicyAnalysis = async (policyName, budget, targetGroup, duration, expectedOutcome) => {
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

    // Debug: log the response data
    console.log('API Response:', response.data);
    return response.data[0].generated_text;
  } catch (error) {
    console.error('API call failed:', error.message);
    throw new Error('Failed to fetch results');
  }
};

module.exports = { generatePolicyAnalysis };