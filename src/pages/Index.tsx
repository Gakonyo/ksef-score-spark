
import React, { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import AdminDashboard from '@/components/AdminDashboard';
import JudgeInterface from '@/components/JudgeInterface';
import { Project, Judge, Score } from '@/components/AdminDashboard';

const Index = () => {
  const [user, setUser] = useState<{ username: string; role: 'admin' | 'judge' } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [markingEnabled, setMarkingEnabled] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('ksef-projects');
    const savedJudges = localStorage.getItem('ksef-judges');
    const savedScores = localStorage.getItem('ksef-scores');
    const savedMarkingEnabled = localStorage.getItem('ksef-marking-enabled');

    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedJudges) setJudges(JSON.parse(savedJudges));
    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedMarkingEnabled) setMarkingEnabled(JSON.parse(savedMarkingEnabled));

    // Add sample data if none exists
    if (!savedProjects || !savedJudges) {
      const sampleProjects: Project[] = [
        {
          id: '1',
          title: 'AI-Powered Water Quality Monitoring System',
          presenter1: 'Jane Kiprotich',
          presenter2: 'David Mwangi',
          category: 'Computer Science',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Sustainable Solar Panel Efficiency Enhancement',
          presenter1: 'Grace Wanjiku',
          presenter2: '',
          category: 'Engineering',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Biodegradable Plastic from Agricultural Waste',
          presenter1: 'Michael Ochieng',
          presenter2: 'Sarah Nyambura',
          category: 'Chemistry',
          createdAt: new Date().toISOString()
        }
      ];

      const sampleJudges: Judge[] = [
        {
          id: '1',
          name: 'Judge A',
          categories: ['Computer Science', 'Engineering'],
          assignedProjects: ['1', '2']
        },
        {
          id: '2',
          name: 'Judge B',
          categories: ['Chemistry', 'Biology'],
          assignedProjects: ['3']
        },
        {
          id: '3',
          name: 'Judge C',
          categories: ['Computer Science', 'Chemistry'],
          assignedProjects: ['1', '3']
        }
      ];

      setProjects(sampleProjects);
      setJudges(sampleJudges);
      localStorage.setItem('ksef-projects', JSON.stringify(sampleProjects));
      localStorage.setItem('ksef-judges', JSON.stringify(sampleJudges));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('ksef-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('ksef-judges', JSON.stringify(judges));
  }, [judges]);

  useEffect(() => {
    localStorage.setItem('ksef-scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('ksef-marking-enabled', JSON.stringify(markingEnabled));
  }, [markingEnabled]);

  const handleLogin = (username: string, role: 'admin' | 'judge') => {
    setUser({ username, role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSubmitScore = (scoreData: Omit<Score, 'id' | 'timestamp'>) => {
    const newScore: Score = {
      ...scoreData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    // Remove existing score from same judge for same project if any
    const filteredScores = scores.filter(
      s => !(s.projectId === scoreData.projectId && s.judgeId === scoreData.judgeId)
    );

    setScores([...filteredScores, newScore]);
  };

  const currentJudge = user?.role === 'judge' 
    ? judges.find(j => j.name === user.username) 
    : undefined;

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (user.role === 'admin') {
    return (
      <AdminDashboard
        onLogout={handleLogout}
        projects={projects}
        judges={judges}
        scores={scores}
        onUpdateProjects={setProjects}
        onUpdateJudges={setJudges}
        onUpdateScores={setScores}
        markingEnabled={markingEnabled}
        onToggleMarking={() => setMarkingEnabled(!markingEnabled)}
      />
    );
  }

  if (user.role === 'judge' && currentJudge) {
    return (
      <JudgeInterface
        judge={currentJudge}
        projects={projects}
        scores={scores}
        onLogout={handleLogout}
        onSubmitScore={handleSubmitScore}
        markingEnabled={markingEnabled}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-4">Judge profile not found</p>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Index;
