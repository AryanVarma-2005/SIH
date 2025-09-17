import { Department } from '../types';

export const departments: Department[] = [
  {
    id: 'transportation',
    name: 'Transportation',
    icon: 'Car',
    description: 'Roads, traffic, public transit, parking',
    color: 'bg-blue-500'
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'GraduationCap',
    description: 'Schools, educational facilities, programs',
    color: 'bg-green-500'
  },
  {
    id: 'health',
    name: 'Health',
    icon: 'Heart',
    description: 'Public health, sanitation, medical facilities',
    color: 'bg-red-500'
  },
  {
    id: 'environment',
    name: 'Environment',
    icon: 'Leaf',
    description: 'Parks, pollution, waste management, conservation',
    color: 'bg-emerald-500'
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    icon: 'Building',
    description: 'Buildings, construction, zoning, permits',
    color: 'bg-gray-500'
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: 'Zap',
    description: 'Water, electricity, gas, telecommunications',
    color: 'bg-yellow-500'
  }
];