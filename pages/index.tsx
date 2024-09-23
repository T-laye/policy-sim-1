import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

// Define the types for the result and analysis
interface Result {
  policy_name: string;
  budget: number;
  target_group: string;
  duration: number;
  expected_outcome: string;
  analysis: string;
}

interface Analysis {
  overview: string;
  impact: string;
  conclusion: string;
}

export default function Home() {
  const [policyName, setPolicyName] = useState<string>('Healthcare Reform');
  const [budget, setBudget] = useState<number>(0);
  const [targetGroup, setTargetGroup] = useState<string>('Low-Income Families');
  const [duration, setDuration] = useState<number>(1);
  const [expectedOutcome, setExpectedOutcome] = useState<string>('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
	e.preventDefault();
	setError(null);
	setLoading(true);

	try {
  	const response = await axios.post('/api/analyze', {
    	policy_name: policyName,
    	budget,
    	target_group: targetGroup,
    	duration,
    	expected_outcome: expectedOutcome
  	});

  	setResult(response.data);
	} catch (error) {
  	setError('Failed to fetch results. Please try again later.');
	} finally {
  	setLoading(false);
	}
  };

  const renderAnalysis = (analysis: string) => {
	const lines = analysis.split('\n').filter(line => line.trim() !== '');

	return (
  	<div>
    	{lines.map((line, index) => (
      	<p key={index}>{line}</p>
    	))}
  	</div>
	);
  };

  return (
	<div className={styles.container}>
  	<div className={styles.card}>
    	<h1 className={styles.title}>Policy Impact Analysis Simulator</h1>
    	<form onSubmit={handleSubmit} className={styles.form}>
      	<div className={styles.inputGroup}>
        	<label htmlFor="policyName" className={styles.label}>Policy Name:</label>
        	<select
          	id="policyName"
          	value={policyName}
          	onChange={(e) => setPolicyName(e.target.value)}
          	className={styles.select}
        	>
          	<option value="Healthcare Reform">Healthcare Reform</option>
          	<option value="Education Funding">Education Funding</option>
          	<option value="Climate Change Policy">Climate Change Policy</option>
          	<option value="Tax Reform">Tax Reform</option>
        	</select>
      	</div>
      	<div className={styles.inputGroup}>
        	<label htmlFor="budget" className={styles.label}>Budget:</label>
        	<input
          	id="budget"
          	type="number"
          	value={budget}
          	onChange={(e) => setBudget(parseFloat(e.target.value))}
          	className={styles.input}
          	required
        	/>
      	</div>
      	<div className={styles.inputGroup}>
        	<label htmlFor="targetGroup" className={styles.label}>Target Group:</label>
        	<select
          	id="targetGroup"
          	value={targetGroup}
          	onChange={(e) => setTargetGroup(e.target.value)}
          	className={styles.select}
        	>
          	<option value="Low-Income Families">Low-Income Families</option>
          	<option value="Small Businesses">Small Businesses</option>
          	<option value="Students">Students</option>
          	<option value="Senior Citizens">Senior Citizens</option>
        	</select>
      	</div>
      	<div className={styles.inputGroup}>
        	<label htmlFor="duration" className={styles.label}>Duration (years):</label>
        	<input
          	id="duration"
          	type="number"
          	value={duration}
          	onChange={(e) => setDuration(parseInt(e.target.value))}
          	className={styles.input}
          	required
        	/>
      	</div>
      	<div className={styles.inputGroup}>
        	<label htmlFor="expectedOutcome" className={styles.label}>Expected Outcome:</label>
        	<input
          	id="expectedOutcome"
          	type="text"
          	value={expectedOutcome}
          	onChange={(e) => setExpectedOutcome(e.target.value)}
          	className={styles.input}
          	required
        	/>
      	</div>
      	<button type="submit" className={styles.button} disabled={loading}>
        	{loading ? 'Analyzing...' : 'Analyze Policy Impact'}
      	</button>
    	</form>
  	</div>

  	{error && (
    	<div className={styles.card}>
      	<h2 className={styles.errorTitle}>Error</h2>
      	<p className={styles.errorMessage}>{error}</p>
    	</div>
  	)}

  	{result && (
    	<div className={styles.card}>
      	<h2 className={styles.resultTitle}>Impact Analysis Result</h2>
      	<div className={styles.analysisText}>
        	{result.analysis ? renderAnalysis(result.analysis) : <p>No analysis available.</p>}
      	</div>
    	</div>
  	)}
	</div>
  );
}
