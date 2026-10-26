export type UserRole = 'panel_reviewer' | 'sales_director' | 'lead_analyst' | 'broker';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  title: string;
  avatarInitials: string;
}

export type TabType =
  | 'overview'
  | 'predictor'
  | 'models'
  | 'confusion-roc'
  | 'shap'
  | 'leads'
  | 'defense';

export interface Lead {
  lead_id: string;
  age: number;
  location: string;
  job_role: string;
  lead_source: string;
  item_checked: string;
  website_visits: number;
  pages_viewed: number;
  time_on_website: number;
  demo_requested_count: number;
  demo_requested_flag: number;
  email_response: 'Fast' | 'Moderate' | 'Slow' | 'No Response';
  days_since_last_interaction: number;
  avg_response_time: number;
  previous_purchases: number;
  budget: number; // in INR
  lead_score: number; // 0 - 100
  preferred_location: string;
  annual_cost_of_living: number;
  conversion_status: 0 | 1;
  predicted_prob: number;
  is_high_value: boolean;
}

export interface ModelBenchmark {
  id: string;
  name: string;
  type: 'ML' | 'Deep Learning';
  family: 'Tree Ensemble' | 'Neural Network' | 'Linear/Instance' | 'Imbalance-Aware';
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  selection_score: number;
  tn: number;
  fp: number;
  fn: number;
  tp: number;
  training_time_sec?: number;
  description: string;
  best_params?: string;
  status: 'Selected Production' | 'Top Performer' | 'Baseline' | 'High Recall Variant';
}

export interface ShapFeature {
  name: string;
  displayName: string;
  category: 'Engagement' | 'Financial' | 'Demographic' | 'Property' | 'Behavioral';
  importance: number;
  meanShap: number;
  direction: 'positive' | 'negative' | 'mixed';
  impactDescription: string;
}

export interface SimulationInput {
  age: number;
  location: string;
  job_role: string;
  lead_source: string;
  item_checked: string;
  website_visits: number;
  pages_viewed: number;
  time_on_website: number;
  demo_requested_count: number;
  email_response: 'Fast' | 'Moderate' | 'Slow' | 'No Response';
  days_since_last_interaction: number;
  avg_response_time: number;
  previous_purchases: number;
  budget: number;
  lead_score: number;
  annual_cost_of_living: number;
}

export interface PredictionResult {
  probability: number;
  predictedClass: 0 | 1;
  isHighValue: boolean;
  tier: 'Platinum High-Value' | 'Gold Prospect' | 'Silver Potential' | 'Cold Nurture';
  confidenceScore: number;
  estimatedDealValue: number;
  expectedRevenue: number;
  recommendedAction: string;
  urgency: 'Immediate (2h)' | 'Same Day (24h)' | 'Automated Drip' | 'Passive Retarget';
  topPositiveDrivers: { name: string; value: string; contribution: number }[];
  topNegativeDrivers: { name: string; value: string; contribution: number }[];
}

export interface ThresholdPoint {
  threshold: number;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  precision: number;
  recall: number;
  f1: number;
  accuracy: number;
  salesOutreachLeads: number;
  workloadSavingsPercent: number;
  missedConversions: number;
}
