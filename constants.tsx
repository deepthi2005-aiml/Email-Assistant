
import { EmailTemplate } from "./types";

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'job-app',
    name: 'Job Application',
    category: 'Career',
    icon: '💼',
    prompt: 'Write a cover letter for a Senior Developer position focusing on React and AI.'
  },
  {
    id: 'meeting-req',
    name: 'Meeting Request',
    category: 'Work',
    icon: '📅',
    prompt: 'Request a 30-minute sync to discuss the Q3 project roadmap.'
  },
  {
    id: 'follow-up',
    name: 'Sales Follow-up',
    category: 'Sales',
    icon: '🚀',
    prompt: 'Gentle follow up with a potential client after sending a proposal last week.'
  },
  {
    id: 'apology',
    name: 'Formal Apology',
    category: 'Professional',
    icon: '🙏',
    prompt: 'Apologize for a delayed project delivery and provide a new timeline.'
  },
  {
    id: 'outreach',
    name: 'Cold Outreach',
    category: 'Networking',
    icon: '👋',
    prompt: 'Introduce yourself to a leader in your industry to ask for a coffee chat.'
  }
];
