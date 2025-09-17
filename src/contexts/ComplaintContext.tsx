import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Complaint } from '../types';

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  getComplaintsByDepartment: (department: string) => Complaint[];
  getComplaintsByStatus: (status: string) => Complaint[];
  getNearbyComplaints: (userLat: number, userLng: number, radiusKm?: number) => Complaint[];
  awardCredits: (citizenId: string, credits: number, complaintId: string, rating: 'excellent' | 'good' | 'poor' | 'fake') => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};

// Mock data for demonstration
const mockComplaints: Complaint[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing damage to vehicles',
    department: 'Transportation',
    category: 'Road Maintenance',
    priority: 'high',
    status: 'in-progress',
    citizenId: '1',
    citizenName: 'John Doe',
    location: { address: '123 Main St, Springfield' },
    attachments: [],
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-12'),
    assignedTo: 'Mike Johnson',
    creditsAwarded: 25,
    qualityRating: 'good'
  },
  {
    id: '2',
    title: 'Broken Streetlight',
    description: 'Streetlight not working for 3 days',
    department: 'Utilities',
    category: 'Lighting',
    priority: 'medium',
    status: 'submitted',
    citizenId: '2',
    citizenName: 'Jane Smith',
    location: { address: '456 Oak Ave, Springfield' },
    attachments: [],
    createdAt: new Date('2025-01-11'),
    updatedAt: new Date('2025-01-11'),
    creditsAwarded: 15,
    qualityRating: 'good'
  },
  // Add more mock complaints with coordinates for nearby feature
  {
    id: '3',
    title: 'Graffiti on Public Building',
    description: 'Vandalism on city hall building needs cleaning',
    department: 'Infrastructure',
    category: 'Buildings',
    priority: 'low',
    status: 'submitted',
    citizenId: '3',
    citizenName: 'Alice Johnson',
    location: { 
      address: '789 City Hall Plaza, Springfield',
      coordinates: { lat: 39.7392, lng: -104.9903 }
    },
    attachments: [],
    createdAt: new Date('2025-01-13'),
    updatedAt: new Date('2025-01-13')
  },
  {
    id: '4',
    title: 'Park Bench Needs Repair',
    description: 'Broken bench in Central Park',
    department: 'Environment',
    category: 'Parks',
    priority: 'medium',
    status: 'in-progress',
    citizenId: '4',
    citizenName: 'Bob Wilson',
    location: { 
      address: 'Central Park, Springfield',
      coordinates: { lat: 39.7412, lng: -104.9923 }
    },
    attachments: [],
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-13'),
    creditsAwarded: 20,
    qualityRating: 'good'
  }
];

export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);

  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newComplaint: Complaint = {
      ...complaintData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setComplaints(prev => [...prev, newComplaint]);
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev =>
      prev.map(complaint =>
        complaint.id === id
          ? { ...complaint, ...updates, updatedAt: new Date() }
          : complaint
      )
    );
  };

  const getComplaintsByDepartment = (department: string) => {
    return complaints.filter(complaint => complaint.department === department);
  };

  const getComplaintsByStatus = (status: string) => {
    return complaints.filter(complaint => complaint.status === status);
  };

  const getNearbyComplaints = (userLat: number, userLng: number, radiusKm: number = 5) => {
    return complaints.filter(complaint => {
      if (!complaint.location?.coordinates) return false;
      
      const distance = calculateDistance(
        userLat, userLng,
        complaint.location.coordinates.lat,
        complaint.location.coordinates.lng
      );
      
      return distance <= radiusKm;
    });
  };

  const awardCredits = (citizenId: string, credits: number, complaintId: string, rating: 'excellent' | 'good' | 'poor' | 'fake') => {
    // Update complaint with credits and rating
    updateComplaint(complaintId, { creditsAwarded: credits, qualityRating: rating });
    
    // In a real app, you'd also update the user's total credits
    console.log(`Awarded ${credits} credits to citizen ${citizenId} for ${rating} complaint`);
  };

  // Helper function to calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  return (
    <ComplaintContext.Provider value={{
      complaints,
      addComplaint,
      updateComplaint,
      getComplaintsByDepartment,
      getComplaintsByStatus,
      getNearbyComplaints,
      awardCredits
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};