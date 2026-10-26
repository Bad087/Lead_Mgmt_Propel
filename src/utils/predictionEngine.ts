import { SimulationInput, PredictionResult } from '../types';

export const SCALING_STATS = {
  age: { mean: 38.09, std: 12.23 },
  website_visits: { mean: 11.64, std: 7.42 },
  pages_viewed: { mean: 31.22, std: 20.58 },
  time_on_website: { mean: 52.27, std: 34.31 },
  days_since_last_interaction: { mean: 27.47, std: 28.87 },
  avg_response_time: { mean: 26.37, std: 38.64 },
  previous_purchases: { mean: 0.42, std: 0.82 },
  budget_log: { mean: 16.92, std: 1.24 },
  lead_score: { mean: 36.81, std: 16.82 },
  annual_cost_of_living: { mean: 624890, std: 178420 },
  demo_requested_count: { mean: 0.45, std: 0.89 },
};

export function predictLeadConversion(input: SimulationInput, threshold = 0.5): PredictionResult {
  // Standardize continuous inputs
  const z_lead_score = (input.lead_score - SCALING_STATS.lead_score.mean) / SCALING_STATS.lead_score.std;
  const z_demo_count = (input.demo_requested_count - SCALING_STATS.demo_requested_count.mean) / SCALING_STATS.demo_requested_count.std;
  const z_web_visits = (input.website_visits - SCALING_STATS.website_visits.mean) / SCALING_STATS.website_visits.std;
  const z_pages_viewed = (input.pages_viewed - SCALING_STATS.pages_viewed.mean) / SCALING_STATS.pages_viewed.std;
  const z_resp_time = (input.avg_response_time - SCALING_STATS.avg_response_time.mean) / SCALING_STATS.avg_response_time.std;
  const z_recency = (input.days_since_last_interaction - SCALING_STATS.days_since_last_interaction.mean) / SCALING_STATS.days_since_last_interaction.std;
  const z_time_site = (input.time_on_website - SCALING_STATS.time_on_website.mean) / SCALING_STATS.time_on_website.std;

  const budgetLog = Math.log(input.budget + 1);
  const z_budget = (budgetLog - SCALING_STATS.budget_log.mean) / SCALING_STATS.budget_log.std;

  // Categorical weights
  let emailResponseEffect = 0;
  if (input.email_response === 'Fast') emailResponseEffect = 0.38;
  else if (input.email_response === 'Moderate') emailResponseEffect = 0.12;
  else if (input.email_response === 'Slow') emailResponseEffect = -0.16;
  else if (input.email_response === 'No Response') emailResponseEffect = -0.48;

  let roleEffect = 0;
  if (['Company Director', 'Investor'].includes(input.job_role)) roleEffect = 0.28;
  else if (['Business Owner', 'Real Estate Developer', 'Doctor'].includes(input.job_role)) roleEffect = 0.18;
  else if (['Entrepreneur', 'Architect'].includes(input.job_role)) roleEffect = 0.12;
  else if (input.job_role === 'Government Employee') roleEffect = -0.15;

  let locationEffect = 0;
  if (['Gurgaon', 'Hyderabad', 'Bengaluru'].includes(input.location)) locationEffect = 0.14;
  else if (input.location === 'Mumbai') locationEffect = 0.08;
  else if (['Kolkata', 'Visakhapatnam'].includes(input.location)) locationEffect = -0.06;

  let sourceEffect = 0;
  if (['Referral', 'Existing Customer'].includes(input.lead_source)) sourceEffect = 0.32;
  else if (['Google Ads', 'Property Portal', 'LinkedIn'].includes(input.lead_source)) sourceEffect = 0.10;
  else if (['Email Campaign', 'Exhibition'].includes(input.lead_source)) sourceEffect = -0.18;

  let itemEffect = 0;
  const itemLower = input.item_checked.toLowerCase();
  if (itemLower.includes('office') || itemLower.includes('commercial') || itemLower.includes('luxury') || itemLower.includes('villa')) {
    itemEffect = 0.22;
  } else if (itemLower.includes('1 bhk')) {
    itemEffect = -0.12;
  }

  // Model Intercept tuned to align with baseline ~27% positive class
  const intercept = -0.995;

  const logit =
    intercept +
    1.32 * z_lead_score +
    0.68 * z_demo_count +
    0.46 * z_web_visits +
    0.36 * z_pages_viewed -
    0.34 * z_resp_time -
    0.26 * z_recency +
    0.22 * z_time_site +
    0.16 * z_budget +
    emailResponseEffect +
    roleEffect +
    locationEffect +
    sourceEffect +
    itemEffect;

  // Logistic Sigmoid
  const rawProbability = 1 / (1 + Math.exp(-logit));
  const probability = Math.min(0.99, Math.max(0.01, Number(rawProbability.toFixed(3))));
  const predictedClass = probability >= threshold ? 1 : 0;

  // High-value definition: probability above threshold AND (budget >= 1.5 Cr OR commercial/villa property)
  const isHighValue =
    probability >= 0.48 &&
    (input.budget >= 15000000 || itemLower.includes('commercial') || itemLower.includes('office') || itemLower.includes('villa'));

  let tier: PredictionResult['tier'] = 'Cold Nurture';
  let recommendedAction = 'Enqueue for periodic newsletter and automated WhatsApp updates.';
  let urgency: PredictionResult['urgency'] = 'Passive Retarget';

  if (isHighValue && probability >= 0.75) {
    tier = 'Platinum High-Value';
    recommendedAction = 'Dispatch Senior Commercial Partner immediately for VIP on-site tour and architectural walkthrough.';
    urgency = 'Immediate (2h)';
  } else if (isHighValue || probability >= 0.65) {
    tier = 'Gold Prospect';
    recommendedAction = 'Schedule priority Discovery Call with Dedicated Portfolio Advisor; share custom ROI proforma.';
    urgency = 'Same Day (24h)';
  } else if (probability >= 0.40) {
    tier = 'Silver Potential';
    recommendedAction = 'Trigger automated personalized interactive floorplan deck and invite to weekend developer showcase.';
    urgency = 'Automated Drip';
  }

  // Estimate deal value and expected revenue
  const estimatedDealValue = input.budget;
  const expectedRevenue = Math.round(estimatedDealValue * probability * 0.02); // 2% advisory commission

  // SHAP Feature Contributions for this individual prediction
  const contributions = [
    { name: 'Lead Propensity Score', value: `${input.lead_score}/100`, contribution: Number((1.32 * z_lead_score).toFixed(3)) },
    { name: 'Site Visit / Demo Requests', value: `${input.demo_requested_count} booked`, contribution: Number((0.68 * z_demo_count).toFixed(3)) },
    { name: 'Website Visits Frequency', value: `${input.website_visits} sessions`, contribution: Number((0.46 * z_web_visits).toFixed(3)) },
    { name: 'Floorplans & Pages Viewed', value: `${input.pages_viewed} pages`, contribution: Number((0.36 * z_pages_viewed).toFixed(3)) },
    { name: 'Inquiry Response Velocity', value: `${input.avg_response_time}h latency`, contribution: Number((-0.34 * z_resp_time).toFixed(3)) },
    { name: 'Days Since Last Contact', value: `${input.days_since_last_interaction} days ago`, contribution: Number((-0.26 * z_recency).toFixed(3)) },
    { name: 'Time on Website', value: `${input.time_on_website} mins`, contribution: Number((0.22 * z_time_site).toFixed(3)) },
    { name: 'Budget Scale', value: `₹${(input.budget / 10000000).toFixed(2)} Cr`, contribution: Number((0.16 * z_budget).toFixed(3)) },
    { name: 'Channel Source Affinity', value: input.lead_source, contribution: Number(sourceEffect.toFixed(3)) },
    { name: 'Email Engagement Speed', value: input.email_response, contribution: Number(emailResponseEffect.toFixed(3)) },
  ];

  const topPositiveDrivers = contributions.filter((c) => c.contribution > 0).sort((a, b) => b.contribution - a.contribution);
  const topNegativeDrivers = contributions.filter((c) => c.contribution < 0).sort((a, b) => a.contribution - b.contribution);

  return {
    probability,
    predictedClass,
    isHighValue,
    tier,
    confidenceScore: Math.round(Math.abs(probability - 0.5) * 200),
    estimatedDealValue,
    expectedRevenue,
    recommendedAction,
    urgency,
    topPositiveDrivers,
    topNegativeDrivers,
  };
}
