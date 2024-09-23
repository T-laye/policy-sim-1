
import { generatePolicyAnalysis } from '../../services/policyAnalysisService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
	const { policy_name, budget, target_group, duration, expected_outcome } = req.body;

	try {
  	const analysis = await generatePolicyAnalysis(policy_name, budget, target_group, duration, expected_outcome);
  	res.status(200).json({
    	policy_name,
    	budget,
    	target_group,
    	duration,
    	expected_outcome,
    	analysis
  	});
	} catch (error) {
  	res.status(500).json({ error: 'Failed to analyze policy. ' + error.message });
	}
  } else {
	res.status(405).json({ message: 'Method Not Allowed' });
  }
}
