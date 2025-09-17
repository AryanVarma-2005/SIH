import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Users, Shield, FileText, TrendingUp, CheckCircle } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl shadow-lg">
                <Building className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              CivicConnect
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline civic complaints and connect citizens with their government. 
              Report issues, track progress, and build stronger communities together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/citizen-login"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
              >
                <Users className="w-5 h-5 inline-block mr-2" />
                Citizen Portal
              </Link>
              <Link
                to="/admin-login"
                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
              >
                <Shield className="w-5 h-5 inline-block mr-2" />
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Empowering Citizens & Government
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A comprehensive platform designed to bridge the gap between citizens and local government services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-blue-50 border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Reporting</h3>
              <p className="text-gray-600">
                Submit complaints with photos, voice recordings, and location data. Simple forms make reporting civic issues effortless.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-teal-50 border border-teal-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track your complaint status in real-time. Get updates from submission to resolution with transparent communication.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-green-50 border border-green-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Efficient Resolution</h3>
              <p className="text-gray-600">
                Advanced admin tools help government departments prioritize, assign, and resolve issues quickly and effectively.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Departments, One Platform
            </h2>
            <p className="text-xl text-gray-600">
              Report issues across all city departments with specialized forms and routing.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {['Transportation', 'Education', 'Health', 'Environment', 'Infrastructure', 'Utilities'].map((dept, index) => (
              <div key={dept} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${
                  ['bg-blue-100', 'bg-green-100', 'bg-red-100', 'bg-emerald-100', 'bg-gray-100', 'bg-yellow-100'][index]
                }`}>
                  <div className={`w-6 h-6 ${
                    ['text-blue-600', 'text-green-600', 'text-red-600', 'text-emerald-600', 'text-gray-600', 'text-yellow-600'][index]
                  }`}>
                    <Building />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{dept}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of citizens already using CivicConnect to improve their communities.
          </p>
          <Link
            to="/citizen-login"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;