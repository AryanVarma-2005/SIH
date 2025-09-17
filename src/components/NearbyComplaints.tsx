import React, { useState, useEffect } from 'react';
import { MapPin, Clock, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { useComplaints } from '../contexts/ComplaintContext';
import { useAuth } from '../contexts/AuthContext';
import { Complaint } from '../types';

const NearbyComplaints: React.FC = () => {
  const { getNearbyComplaints } = useComplaints();
  const { user } = useAuth();
  const [nearbyComplaints, setNearbyComplaints] = useState<Complaint[]>([]);
  const [radius, setRadius] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.location) {
      setLoading(true);
      const nearby = getNearbyComplaints(user.location.lat, user.location.lng, radius);
      setNearbyComplaints(nearby);
      setLoading(false);
    }
  }, [user, radius, getNearbyComplaints]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'in-review':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  if (!user?.location) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Nearby Complaints</h2>
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Location access required</p>
          <p className="text-sm text-gray-400">Enable location to see nearby complaints</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">What's Happening Nearby</h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Radius:</label>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>1 km</option>
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading nearby complaints...</p>
        </div>
      ) : nearbyComplaints.length === 0 ? (
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No complaints in your area</p>
          <p className="text-sm text-gray-400">Your neighborhood is doing great!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {nearbyComplaints.map((complaint) => (
            <div key={complaint.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">{complaint.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{complaint.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {complaint.location?.address}
                    </span>
                    <span className="flex items-center">
                      <AlertCircle className={`w-3 h-3 mr-1 ${getPriorityColor(complaint.priority)}`} />
                      {complaint.priority}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-3">
                  {getStatusIcon(complaint.status)}
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>{complaint.department}</span>
                  <span>•</span>
                  <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
                {complaint.creditsAwarded && (
                  <span className="text-xs text-green-600 font-medium">
                    +{complaint.creditsAwarded} credits
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyComplaints;