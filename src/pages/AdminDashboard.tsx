import React, { useState } from 'react';
import { BarChart3, Users, Clock, CheckCircle, AlertTriangle, Filter, Search, Eye } from 'lucide-react';
import { useComplaints } from '../contexts/ComplaintContext';
import { departments } from '../data/departments';

const AdminDashboard: React.FC = () => {
  const { complaints, updateComplaint, loading } = useComplaints();
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComplaints = complaints.filter(complaint => {
    const matchesDepartment = selectedDepartment === 'all' || complaint.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || complaint.status === selectedStatus;
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesStatus && matchesSearch;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'submitted' || c.status === 'in-review').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length
  };

  const departmentStats = departments.map(dept => ({
    ...dept,
    count: complaints.filter(c => c.department === dept.name).length
  }));

  const handleStatusUpdate = (complaintId: string, newStatus: string) => {
    updateComplaint(complaintId, { status: newStatus as any });
    
    // Award credits based on complaint quality when resolved
    if (newStatus === 'resolved') {
      const complaint = complaints.find(c => c.id === complaintId);
      if (complaint && !complaint.creditsAwarded) {
        // In a real app, admin would rate the complaint quality
        const rating = 'good'; // This would be selected by admin
        const credits = rating === 'excellent' ? 25 : rating === 'good' ? 15 : rating === 'poor' ? 5 : -10;
        updateComplaint(complaintId, { creditsAwarded: credits, qualityRating: rating });
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'in-review': return 'bg-purple-100 text-purple-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage civic complaints across all departments</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Complaint Management */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border">
              {/* Filters */}
              <div className="p-6 border-b">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search complaints..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>

                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Statuses</option>
                      <option value="submitted">Submitted</option>
                      <option value="in-review">In Review</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Complaints List */}
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-gray-500">Loading complaints...</p>
                  </div>
                ) : filteredComplaints.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No complaints found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredComplaints.map((complaint) => (
                      <div key={complaint.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(complaint.priority)}`}>
                                {complaint.priority}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{complaint.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{complaint.department} • {complaint.category}</span>
                              <span>{complaint.citizenName}</span>
                              <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                              {complaint.location && (
                                <span>{complaint.location.address}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 ml-4">
                            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(complaint.status)}`}>
                              {complaint.status.replace('-', ' ')}
                            </span>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-600">Update Status:</label>
                            <select
                              value={complaint.status}
                              onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                              className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="submitted">Submitted</option>
                              <option value="in-review">In Review</option>
                              <option value="in-progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                            
                            {complaint.status === 'resolved' && !complaint.creditsAwarded && (
                              <select
                                onChange={(e) => {
                                  const rating = e.target.value as 'excellent' | 'good' | 'poor' | 'fake';
                                  const credits = rating === 'excellent' ? 50 : rating === 'good' ? 25 : rating === 'poor' ? 5 : -100;
                                  updateComplaint(complaint.id, { creditsAwarded: credits, qualityRating: rating });
                                }}
                                className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                defaultValue=""
                              >
                                <option value="" disabled>Rate Quality</option>
                                <option value="excellent">Excellent (+50)</option>
                                <option value="good">Good (+25)</option>
                                <option value="poor">Poor (+5)</option>
                                <option value="fake">Fake (-100)</option>
                              </select>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            {complaint.creditsAwarded && (
                              <span className={`text-sm font-medium ${
                                complaint.creditsAwarded > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {complaint.creditsAwarded > 0 ? '+' : ''}{complaint.creditsAwarded} credits
                              </span>
                            )}
                            {complaint.assignedTo && (
                              <span className="text-sm text-gray-600">
                                Assigned to: {complaint.assignedTo}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Department Statistics */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Department Overview</h2>
              
              <div className="space-y-4">
                {departmentStats.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${dept.color} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-xs font-semibold">
                          {dept.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{dept.name}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-600">{dept.count}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Resolution Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;