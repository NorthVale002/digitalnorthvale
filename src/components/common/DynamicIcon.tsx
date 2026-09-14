import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  // Normalize name
  const cleanName = name ? name.trim() : '';
  const IconComponent = (LucideIcons as Record<string, any>)[cleanName] || LucideIcons.HelpCircle;

  return <IconComponent className={className} size={size} />;
};

export const AVAILABLE_ICONS = [
  'Globe',
  'Layout',
  'Palette',
  'BookOpen',
  'Shield',
  'Zap',
  'Star',
  'Sparkles',
  'CheckCircle2',
  'Compass',
  'Heart',
  'Layers',
  'Feather',
  'Sliders',
  'Send',
  'Terminal',
  'Flame',
  'FileText',
  'Users',
  'MessageSquare',
  'TrendingUp',
  'Briefcase',
  'Phone',
  'Mail',
];
