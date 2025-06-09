
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Download, Upload, BookOpen, LogOut, User } from 'lucide-react';
import PastPapers from '@/components/PastPapers';
import Assignments from '@/components/Assignments';

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const auth = localStorage.getItem('studentAuth');
    if (!auth) {
      navigate('/student-login');
      return;
    }
    
    const parsedAuth = JSON.parse(auth);
    setStudentInfo(parsedAuth);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('studentAuth');
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    navigate('/');
  };

  if (!studentInfo) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">Student Portal</h1>
                <p className="text-blue-200 text-sm">Ngelelya Secondary School</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{studentInfo.admissionNumber}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-white border-white hover:bg-white hover:text-blue-900"
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
              { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
              { id: 'pastpapers', label: 'Past Papers', icon: BookOpen },
              { id: 'assignments', label: 'Assignments', icon: Upload }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-blue-600'
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
            {/* Hero Section */}
            <div 
              className="relative rounded-lg overflow-hidden mb-8 h-64 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
              }}
            >
              <div className="absolute inset-0 bg-blue-900/70"></div>
              <div className="relative h-full flex items-center justify-center text-white text-center">
                <div>
                  <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                  <p className="text-xl">Ready to continue your learning journey?</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('pastpapers')}>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Past Papers</CardTitle>
                  <CardDescription>Download past examination papers by form</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('assignments')}>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <Upload className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Assignments</CardTitle>
                  <CardDescription>View and submit your assignments</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <Download className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Study Materials</CardTitle>
                  <CardDescription>Access additional learning resources</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'pastpapers' && <PastPapers userType="student" />}
        {activeTab === 'assignments' && <Assignments userType="student" />}
      </main>
    </div>
  );
};

export default StudentPortal;
