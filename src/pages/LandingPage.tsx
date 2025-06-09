
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, BookOpen, School } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <School className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold">NGELELYA SECONDARY SCHOOL</h1>
                <p className="text-blue-200 text-sm">Excellence in Education</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span>📧 info@ngelelyasecondary.ac.ke</span>
              <span>📞 +254 XXX XXX XXX</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        ></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h2 className="text-5xl font-bold mb-6">Welcome to Ngelelya Secondary School</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Empowering students with quality education and nurturing tomorrow's leaders through excellence in academics and character development.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
              <BookOpen className="h-5 w-5" />
              <span>Quality Education</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
              <Users className="h-5 w-5" />
              <span>Experienced Staff</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
              <GraduationCap className="h-5 w-5" />
              <span>Student Success</span>
            </div>
          </div>
        </div>
      </section>

      {/* Login Options */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-900 mb-4">Access Your Portal</h3>
            <p className="text-gray-600 text-lg">Choose your portal to access personalized resources and tools</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Portal */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-900">Student Portal</CardTitle>
                <CardDescription className="text-gray-600">
                  Access your assignments, past papers, and academic resources
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 mb-6 space-y-2">
                  <li>✓ Download past papers by form</li>
                  <li>✓ View and submit assignments</li>
                  <li>✓ Access study materials</li>
                  <li>✓ Track your progress</li>
                </ul>
                <Link to="/student-login">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                    Student Login
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Staff Portal */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-blue-900">Staff Portal</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage assignments, upload resources, and track student progress
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 mb-6 space-y-2">
                  <li>✓ Upload past papers and resources</li>
                  <li>✓ Create and manage assignments</li>
                  <li>✓ Collect student feedback</li>
                  <li>✓ Monitor student progress</li>
                </ul>
                <Link to="/staff-login">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                    Staff Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <School className="h-8 w-8" />
                <h4 className="text-xl font-bold">Ngelelya Secondary School</h4>
              </div>
              <p className="text-blue-200 mb-4">
                Committed to providing quality education and nurturing responsible citizens for tomorrow's world.
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact Information</h5>
              <div className="space-y-2 text-blue-200">
                <p>📍 P.O. Box XXX, Ngelelya, Kenya</p>
                <p>📧 info@ngelelyasecondary.ac.ke</p>
                <p>📞 +254 XXX XXX XXX</p>
                <p>🌐 www.ngelelyasecondary.ac.ke</p>
              </div>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Follow Us</h5>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-200 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">Instagram</a>
              </div>
              <div className="mt-6">
                <p className="text-blue-200 text-sm">
                  &copy; 2024 Ngelelya Secondary School. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
