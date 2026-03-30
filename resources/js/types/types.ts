export type View = 'home' | 'projects' | 'stack' | 'contact' | 'logs';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  statusColor: string;
}

export interface TechStack {
  name: string;
  experience: string;
  description: string;
  tags: string[];
  category: 'PRIMARY_ENGINE' | 'STABLE' | 'LEGACY_MOD';
  icon: string;
}
