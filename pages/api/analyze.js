import { generatePolicyAnalysis } from './policyAnalysisService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { policy_name, budget, target_group, duration, expected_outcome } = req.body;

    try {
      // Call the policy analysis service
      const analysis = await generatePolicyAnalysis(policy_name, budget, target_group, duration, expected_outcome);

      // Return the generated analysis as JSON response
      res.status(200).json({
        policy_name,
        budget,
        target_group,
        duration,
        expected_outcome,
        analysis,
      });
    } catch (error) {
      console.error('Error while analyzing policy:', error.message);
      // Return detailed error message to the client
      res.status(500).json({ error: 'Failed to analyze policy. ' + error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}