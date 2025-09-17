import React from 'react';
import { Link } from 'react-router-dom';
import { Car, GraduationCap, Heart, Leaf, Building, Zap, Plus, FileText, Clock, CheckCircle } from 'lucide-react';
import { departments } from '../data/departments';
import { useComplaints } from '../contexts/ComplaintContext';
import { useAuth } from '../contexts/AuthContext';
import NearbyComplaints from '../components/NearbyComplaints';
import CreditSystem from '../components/CreditSystem';

const iconMap = {
  Car,
  GraduationCap,
  Heart,
  Leaf,
  Building,
  Zap
};

const UserDashboard: React.FC = () => {
  const { complaints } = useComplaints();
  const { user } = useAuth();

  const userComplaints = complaints.filter(c => c.citizenId === user?.id);
  const recentComplaints = userComplaints.slice(0, 3);

  const statusCounts = {
    total: userComplaints.length,
    pending: userComplaints.filter(c => c.status === 'submitted' || c.status === 'in-review').length,
    inProgress: userComplaints.filter(c => c.status === 'in-progress').length,
    resolved: userComplaints.filter(c => c.status === 'resolved' || c.status === 'closed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600">
            Select a department to file a new complaint or track your existing submissions.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-amber-600">{statusCounts.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Department Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">File a New Complaint</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Plus className="w-4 h-4 mr-1" />
                  Select Department
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {departments.map((dept) => {
                  const IconComponent = iconMap[dept.icon as keyof typeof iconMap];
                  return (
                    <Link
                      key={dept.id}
                      to={`/complaint/${dept.id}`}
                      className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${dept.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {dept.name}
                          </h3>
                          <p className="text-sm text-gray-600">{dept.description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Credit System */}
              <CreditSystem />
              
              {/* Recent Complaints */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Complaints</h2>
              
                {recentComplaints.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No complaints yet</p>
                    <p className="text-sm text-gray-400">File your first complaint to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentComplaints.map((complaint) => (
                      <div key={complaint.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 text-sm">{complaint.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {complaint.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{complaint.department}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </p>
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

                {userComplaints.length > 3 && (
                  <div className="mt-4 text-center">
                    <Link to="/my-complaints" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all complaints →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nearby Complaints - Full Width */}
          <div className="lg:col-span-1">
            <NearbyComplaints />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;