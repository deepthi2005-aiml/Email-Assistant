
export enum EmailTone {
  PROFESSIONAL = 'Professional',
  CASUAL = 'Casual',
  PERSUASIVE = 'Persuasive',
  FRIENDLY = 'Friendly',
  APOLOGETIC = 'Apologetic',
  URGENT = 'Urgent'
}

export enum EmailLength {
  CONCISE = 'Concise',
  STANDARD = 'Standard',
  DETAILED = 'Detailed'
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  icon: string;
  prompt: string;
}

export interface GeneratedEmail {
  subjectLines: string[];
  body: string;
  salutation: string;
  closing: string;
  suggestedFollowUp?: string;
}

export interface ABTestResult {
  versionA: {
    strategy: string;
    subject: string;
    body: string;
    trackingTip: string;
  };
  versionB: {
    strategy: string;
    subject: string;
    body: string;
    trackingTip: string;
  };
  generalAdvice: string;
}

export interface EnhancementResult {
  corrections: string[];
  toneAssessment: string;
  claritySuggestions: string[];
  alternativePhrasing: string[];
  effectivenessScore: number;
}

export interface SavedEmail {
  id: string;
  subject: string;
  body: string;
  timestamp: number;
  category: string;
}
