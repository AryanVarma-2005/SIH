import React from 'react';
import { Star, Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CreditSystem: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'citizen') return null;

  const getCreditLevel = (credits: number) => {
    if (credits >= 500) return { level: 'Gold Citizen', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (credits >= 250) return { level: 'Silver Citizen', color: 'text-gray-600', bg: 'bg-gray-100' };
    if (credits >= 100) return { level: 'Bronze Citizen', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'New Citizen', color: 'text-blue-600', bg: 'bg-blue-100' };
  };

  const creditLevel = getCreditLevel(user.credits);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Civic Credits</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${creditLevel.bg} ${creditLevel.color}`}>
          {creditLevel.level}
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Star className="w-8 h-8 text-yellow-500 mr-2" />
          <span className="text-3xl font-bold text-gray-900">{user.credits}</span>
        </div>
        <p className="text-gray-600">Total Credits Earned</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <Award className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-green-900">Excellent Complaint</p>
              <p className="text-sm text-green-600">+50 credits</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-blue-900">Good Complaint</p>
              <p className="text-sm text-blue-600">+25 credits</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <p className="font-medium text-red-900">Fake Complaint</p>
              <p className="text-sm text-red-600">-100 credits</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="font-semibold text-gray-900 mb-3">How to Earn Credits</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Submit detailed, accurate complaints</li>
          <li>• Include photos and location information</li>
          <li>• Report genuine civic issues</li>
          <li>• Help improve your community</li>
        </ul>
      </div>
    </div>
  );
};

export default CreditSystem;