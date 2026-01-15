
import React from 'react';
import { EMAIL_TEMPLATES } from '../constants';
import { EmailTemplate } from '../types';

interface TemplateGalleryProps {
  onSelect: (template: EmailTemplate) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelect }) => {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Email Templates</h2>
        <p className="text-slate-500">Choose a starting point to generate a professional email in seconds.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EMAIL_TEMPLATES.map(template => (
          <div 
            key={template.id}
            onClick={() => onSelect(template)}
            className="group cursor-pointer bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200"
          >
            <div className="text-3xl mb-4">{template.icon}</div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 mb-2">{template.name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2">{template.prompt}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">{template.category}</span>
              <span className="text-indigo-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Use Template →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
