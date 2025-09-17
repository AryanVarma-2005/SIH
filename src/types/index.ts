export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
  department?: string;
  credits: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  department: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'in-review' | 'in-progress' | 'resolved' | 'closed';
  citizenId: string;
  citizenName: string;
  location?: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  resolutionNotes?: string;
  creditsAwarded?: number;
  qualityRating?: 'excellent' | 'good' | 'poor' | 'fake';
}

export interface Department {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}