import test from 'node:test';
import assert from 'node:assert/strict';
import { predictLeadConversion } from './predictionEngine';
import { SimulationInput } from '../types';

const HIGH_INTENT_LEAD: SimulationInput = {
  age: 44,
  location: 'Bengaluru',
  job_role: 'Company Director',
  lead_source: 'Referral',
  item_checked: 'Office space -> Commercial plot',
  website_visits: 28,
  pages_viewed: 75,
  time_on_website: 140,
  demo_requested_count: 3,
  email_response: 'Fast',
  days_since_last_interaction: 2,
  avg_response_time: 1.5,
  previous_purchases: 2,
  budget: 45000000,
  lead_score: 92,
  annual_cost_of_living: 850000,
};

const COLD_LEAD: SimulationInput = {
  age: 26,
  location: 'Kochi',
  job_role: 'Government Employee',
  lead_source: 'Email Campaign',
  item_checked: '1 BHK apartment',
  website_visits: 3,
  pages_viewed: 6,
  time_on_website: 8,
  demo_requested_count: 0,
  email_response: 'No Response',
  days_since_last_interaction: 55,
  avg_response_time: 80,
  previous_purchases: 0,
  budget: 3500000,
  lead_score: 12,
  annual_cost_of_living: 390000,
};

test('prediction engine produces valid probability between 0 and 1', () => {
  const result = predictLeadConversion(HIGH_INTENT_LEAD);
  assert.ok(result.probability >= 0 && result.probability <= 1);
  assert.equal(result.predictedClass, 1);
  assert.equal(result.isHighValue, true);
  assert.equal(result.tier, 'Platinum High-Value');
});

test('cold lead scores low probability and is classified as non-converter', () => {
  const result = predictLeadConversion(COLD_LEAD);
  assert.ok(result.probability < 0.35);
  assert.equal(result.predictedClass, 0);
  assert.equal(result.isHighValue, false);
});

test('feature driver contributions are computed and split properly', () => {
  const result = predictLeadConversion(HIGH_INTENT_LEAD);
  assert.ok(result.topPositiveDrivers.length > 0);
  assert.ok(result.topPositiveDrivers.some((d) => d.name === 'Lead Propensity Score'));
  assert.ok(result.expectedRevenue > 0);
});
