export type View = 'home' | 'projects' | 'stack' | 'contact' | 'logs';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: 'ACTIVE_DEPLOYS' | 'STABLE' | 'MAINTENANCE' | 'R&D' | 'CORE_INFRA';
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
