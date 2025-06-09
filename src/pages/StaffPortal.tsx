
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users, Upload, FileText, MessageSquare, LogOut, User } from 'lucide-react';
import PastPapers from '@/components/PastPapers';
import Assignments from '@/components/Assignments';
import Feedback from '@/components/Feedback';

const StaffPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [staffInfo, setStaffInfo] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const auth = localStorage.getItem('staffAuth');
    if (!auth) {
      navigate('/staff-login');
      return;
    }
    
    const parsedAuth = JSON.parse(auth);
    setStaffInfo(parsedAuth);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('staffAuth');
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    navigate('/');
  };

  if (!staffInfo) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">Staff Portal</h1>
                <p className="text-green-200 text-sm">Ngelelya Secondary School</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{staffInfo.staffId}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-white border-white hover:bg-white hover:text-green-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Users },
              { id: 'pastpapers', label: 'Manage Past Papers', icon: Upload },
              { id: 'assignments', label: 'Assignments', icon: FileText },
              { id: 'feedback', label: 'Student Feedback', icon: MessageSquare }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-green-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-green-800 mb-4">Staff Dashboard</h2>
              <p className="text-gray-600">Manage your teaching resources and track student progress</p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('pastpapers')}>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Add Past Papers</CardTitle>
                  <CardDescription>Upload examination papers and study materials</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('assignments')}>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Manage Assignments</CardTitle>
                  <CardDescription>Create and track student assignments</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('feedback')}>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Student Feedback</CardTitle>
                  <CardDescription>View anonymous feedback from students</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'pastpapers' && <PastPapers userType="staff" />}
        {activeTab === 'assignments' && <Assignments userType="staff" />}
        {activeTab === 'feedback' && <Feedback />}
      </main>
    </div>
  );
};

export default StaffPortal;
