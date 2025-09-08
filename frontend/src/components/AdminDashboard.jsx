import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Download, 
  Search, 
  Filter,
  Eye,
  X,
  FileText,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  LogOut,
  BarChart3
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = ({ onLogout }) => {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('adminToken');

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchStats();
  }, [filters]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_URL}/api/admin/registrations?${params}`, axiosConfig);
      setRegistrations(response.data.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/stats`, axiosConfig);
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`${API_URL}/api/admin/registrations/${id}/approve`, {}, axiosConfig);
      toast.success('Registration approved successfully!');
      fetchRegistrations();
      fetchStats();
    } catch (error) {
      console.error('Error approving registration:', error);
      toast.error('Failed to approve registration');
    }
  };

  const handleReject = async (id, reason) => {
    try {
      await axios.post(`${API_URL}/api/admin/registrations/${id}/reject`, { reason }, axiosConfig);
      toast.success('Registration rejected');
      fetchRegistrations();
      fetchStats();
    } catch (error) {
      console.error('Error rejecting registration:', error);
      toast.error('Failed to reject registration');
    }
  };

  const handleDownloadCertificate = async (id, fullName) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/registrations/${id}/certificate`,
        {
          ...axiosConfig,
          responseType: 'blob'
        }
      );
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${fullName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const RegistrationModal = ({ registration, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Registration Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-gray-900">{registration.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{registration.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Contact</label>
                <p className="text-gray-900">{registration.contactNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900">{registration.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <p className="text-gray-900">{registration.category}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">College</label>
                <p className="text-gray-900">{registration.college}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Qualification</label>
                <p className="text-gray-900">{registration.qualification}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Course</label>
                <p className="text-gray-900">{registration.course}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Payment Date</label>
                <p className="text-gray-900">{new Date(registration.paymentDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Payment Reference</label>
                <p className="text-gray-900">{registration.paymentRef}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-600">Address</label>
            <p className="text-gray-900">{registration.address}</p>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            {!registration.approved && !registration.rejected && (
              <>
                <button
                  onClick={() => handleApprove(registration._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(registration._id, 'Not meeting requirements')}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </>
            )}
            
            {registration.approved && (
              <button
                onClick={() => handleDownloadCertificate(registration._id, registration.fullName)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Certificate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">JNTU-GV Certification System</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Registrations"
            value={stats.total || 0}
            color="bg-blue-500"
          />
          <StatCard
            icon={CheckCircle}
            title="Approved"
            value={stats.approved || 0}
            color="bg-green-500"
          />
          <StatCard
            icon={Clock}
            title="Pending"
            value={stats.pending || 0}
            color="bg-yellow-500"
          />
          <StatCard
            icon={BarChart3}
            title="This Month"
            value={stats.monthlyStats?.[0]?.count || 0}
            color="bg-purple-500"
          />
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or course..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Registrations</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registration.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {registration.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(registration.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          registration.approved 
                            ? 'bg-green-100 text-green-800' 
                            : registration.rejected
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {registration.approved ? 'Approved' : registration.rejected ? 'Rejected' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedRegistration(registration)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {!registration.approved && !registration.rejected && (
                            <button
                              onClick={() => handleApprove(registration._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          {registration.approved && (
                            <button
                              onClick={() => handleDownloadCertificate(registration._id, registration.fullName)}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {selectedRegistration && (
        <RegistrationModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;