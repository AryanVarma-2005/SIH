import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Complaint } from '../types';

interface ComplaintContextType {
  complaints: Complaint[];
  loading: boolean;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  getComplaintsByDepartment: (department: string) => Complaint[];
  getComplaintsByStatus: (status: string) => Complaint[];
  getNearbyComplaints: (userLat: number, userLng: number, radiusKm?: number) => Complaint[];
  awardCredits: (citizenId: string, credits: number, complaintId: string, rating: 'excellent' | 'good' | 'poor' | 'fake') => void;
  fetchComplaints: () => Promise<void>;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};


export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Convert database row to Complaint type
  const dbRowToComplaint = (row: any): Complaint => ({
    id: row.id,
    title: row.title,
    description: row.description,
    department: row.department,
    category: row.category,
    priority: row.priority,
    status: row.status,
    citizenId: row.citizen_id,
    citizenName: row.citizen_name,
    location: row.location_address ? {
      address: row.location_address,
      coordinates: row.location_lat && row.location_lng ? {
        lat: row.location_lat,
        lng: row.location_lng
      } : undefined
    } : undefined,
    attachments: row.attachments || [],
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    assignedTo: row.assigned_to,
    resolutionNotes: row.resolution_notes,
    creditsAwarded: row.credits_awarded,
    qualityRating: row.quality_rating
  });

  const fetchComplaints = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase.from('complaints').select('*');
      
      // If user is citizen, only fetch their complaints
      if (user.role === 'citizen') {
        query = query.eq('citizen_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedComplaints = data.map(dbRowToComplaint);
      setComplaints(formattedComplaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch complaints when user changes
  React.useEffect(() => {
    if (user) {
      fetchComplaints();
    }
  }, [user]);

  const addComplaint = async (complaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('complaints')
        .insert({
          title: complaintData.title,
          description: complaintData.description,
          department: complaintData.department,
          category: complaintData.category,
          priority: complaintData.priority,
          status: complaintData.status,
          citizen_id: complaintData.citizenId,
          citizen_name: complaintData.citizenName,
          location_address: complaintData.location?.address,
          location_lat: complaintData.location?.coordinates?.lat,
          location_lng: complaintData.location?.coordinates?.lng,
          attachments: complaintData.attachments
        })
        .select()
        .single();

      if (error) throw error;

      const newComplaint = dbRowToComplaint(data);
      setComplaints(prev => [newComplaint, ...prev]);
    } catch (error) {
      console.error('Error adding complaint:', error);
      throw error;
    }
  };

  const updateComplaint = async (id: string, updates: Partial<Complaint>) => {
    try {
      const dbUpdates: any = {};
      
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.department) dbUpdates.department = updates.department;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.priority) dbUpdates.priority = updates.priority;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
      if (updates.resolutionNotes !== undefined) dbUpdates.resolution_notes = updates.resolutionNotes;
      if (updates.creditsAwarded !== undefined) dbUpdates.credits_awarded = updates.creditsAwarded;
      if (updates.qualityRating !== undefined) dbUpdates.quality_rating = updates.qualityRating;
      if (updates.location) {
        dbUpdates.location_address = updates.location.address;
        dbUpdates.location_lat = updates.location.coordinates?.lat;
        dbUpdates.location_lng = updates.location.coordinates?.lng;
      }

      const { data, error } = await supabase
        .from('complaints')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedComplaint = dbRowToComplaint(data);
      setComplaints(prev =>
        prev.map(complaint =>
          complaint.id === id ? updatedComplaint : complaint
        )
      );

      // If credits were awarded, update user's credits
      if (updates.creditsAwarded !== undefined && user?.role === 'admin') {
        const complaint = complaints.find(c => c.id === id);
        if (complaint) {
          await supabase
            .from('profiles')
            .update({ 
              credits: supabase.raw(`credits + ${updates.creditsAwarded}`)
            })
            .eq('id', complaint.citizenId);
        }
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw error;
    }
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

  const awardCredits = async (citizenId: string, credits: number, complaintId: string, rating: 'excellent' | 'good' | 'poor' | 'fake') => {
    try {
      // Update complaint with credits and rating
      await updateComplaint(complaintId, { creditsAwarded: credits, qualityRating: rating });
      
      // Update user's total credits
      await supabase
        .from('profiles')
        .rpc('increment_credits', { user_id: citizenId, credit_amount: credits });
    } catch (error) {
      console.error('Error awarding credits:', error);
      throw error;
    }
  };

  const updateComplaint = async (id: string, updates: Partial<Complaint>) => {
    try {
      const dbUpdates: any = {};
      
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.department) dbUpdates.department = updates.department;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.priority) dbUpdates.priority = updates.priority;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
      if (updates.resolutionNotes !== undefined) dbUpdates.resolution_notes = updates.resolutionNotes;
      if (updates.creditsAwarded !== undefined) dbUpdates.credits_awarded = updates.creditsAwarded;
      if (updates.qualityRating !== undefined) dbUpdates.quality_rating = updates.qualityRating;
      if (updates.location) {
        dbUpdates.location_address = updates.location.address;
        dbUpdates.location_lat = updates.location.coordinates?.lat;
        dbUpdates.location_lng = updates.location.coordinates?.lng;
      }

      const { data, error } = await supabase
        .from('complaints')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedComplaint = dbRowToComplaint(data);
      setComplaints(prev =>
        prev.map(complaint =>
          complaint.id === id ? updatedComplaint : complaint
        )
      );

      // If credits were awarded, update user's credits
      if (updates.creditsAwarded !== undefined && user?.role === 'admin') {
        const complaint = complaints.find(c => c.id === id);
        if (complaint) {
          // Credits are handled in awardCredits function
        }
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw error;
    }
  };

  const awardCredits = async (citizenId: string, credits: number, complaintId: string, rating: 'excellent' | 'good' | 'poor' | 'fake') => {
    try {
      // Update complaint with credits and rating
      await updateComplaint(complaintId, { creditsAwarded: credits, qualityRating: rating });
      
      // Update user's total credits using RPC function
      await supabase
        .rpc('increment_credits', { user_id: citizenId, credit_amount: credits });
        .eq('id', citizenId);
    } catch (error) {
      console.error('Error awarding credits:', error);
      throw error;
    }
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
      loading,
      addComplaint,
      updateComplaint,
      getComplaintsByDepartment,
      getComplaintsByStatus,
      getNearbyComplaints,
      awardCredits,
      fetchComplaints
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};