const axios = require('axios');
const { apiKey, apiUrl } = require('../config/apiConfig');

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const generatePolicyAnalysis = async (policyName, budget, targetGroup, duration, expectedOutcome, retries = 3) => {
  const prompt = `
	Analyze the following policy:
	Policy Name: ${policyName}
	Budget: ${budget}
	Target Group: ${targetGroup}
	Duration: ${duration} years
	Expected Outcome: ${expectedOutcome}
	Provide a detailed analysis of the potential impact.
  `;

  try {
	const response = await axios.post(apiUrl, {
  	inputs: prompt,
	}, {
  	headers: {
    	Authorization: `Bearer ${apiKey}`,
  	},
	});

	return response.data[0].generated_text;
  } catch (error) {
	if (error.response && error.response.data && error.response.data.error.includes('currently loading')) {
  	const estimatedTime = error.response.data.estimated_time || 60;

  	if (retries <= 0) {
    	throw new Error('Model is still loading and retries are exhausted.');
  	}

  	console.log(`Model is still loading. Retrying in ${estimatedTime} seconds...`);
  	await sleep(estimatedTime * 1000);
  	return generatePolicyAnalysis(policyName, budget, targetGroup, duration, expectedOutcome, retries - 1);
	} else {
  	throw new Error('Failed to analyze policy');
	}
  }
};

module.exports = { generatePolicyAnalysis };
