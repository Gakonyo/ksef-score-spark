
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ProjectManagement from './ProjectManagement';
import JudgeManagement from './JudgeManagement';
import ResultsOverview from './ResultsOverview';

interface AdminDashboardProps {
  onLogout: () => void;
  projects: Project[];
  judges: Judge[];
  scores: Score[];
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateJudges: (judges: Judge[]) => void;
  onUpdateScores: (scores: Score[]) => void;
  markingEnabled: boolean;
  onToggleMarking: () => void;
}

export interface Project {
  id: string;
  title: string;
  presenter1: string;
  presenter2: string;
  category: string;
  createdAt: string;
}

export interface Judge {
  id: string;
  name: string;
  categories: string[];
  assignedProjects: string[];
}

export interface Score {
  id: string;
  projectId: string;
  judgeId: string;
  section1: number;
  section2: number;
  section3: number;
  total: number;
  timestamp: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  projects,
  judges,
  scores,
  onUpdateProjects,
  onUpdateJudges,
  onUpdateScores,
  markingEnabled,
  onToggleMarking
}) => {
  const { toast } = useToast();

  const handleExportResults = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Project,Presenter1,Presenter2,Category,Judge,Section1,Section2,Section3,Total,Timestamp\n"
      + scores.map(score => {
        const project = projects.find(p => p.id === score.projectId);
        const judge = judges.find(j => j.id === score.judgeId);
        return `${project?.title || 'Unknown'},${project?.presenter1 || ''},${project?.presenter2 || ''},${project?.category || ''},${judge?.name || 'Unknown'},${score.section1},${score.section2},${score.section3},${score.total},${score.timestamp}`;
      }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ksef_results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "Results exported to CSV file",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">KSEF Admin Dashboard</h1>
            <p className="text-gray-600">Manage projects, judges, and scoring</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="marking-toggle"
                checked={markingEnabled}
                onCheckedChange={onToggleMarking}
              />
              <Label htmlFor="marking-toggle">Enable Marking</Label>
              <Badge variant={markingEnabled ? "default" : "secondary"}>
                {markingEnabled ? "Active" : "Disabled"}
              </Badge>
            </div>
            <Button onClick={handleExportResults} variant="outline">
              Export Results
            </Button>
            <Button onClick={onLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Judges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{judges.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{scores.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {new Set(projects.map(p => p.category)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="judges">Judges</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectManagement 
              projects={projects}
              onUpdateProjects={onUpdateProjects}
            />
          </TabsContent>

          <TabsContent value="judges">
            <JudgeManagement 
              judges={judges}
              projects={projects}
              onUpdateJudges={onUpdateJudges}
            />
          </TabsContent>

          <TabsContent value="results">
            <ResultsOverview 
              projects={projects}
              judges={judges}
              scores={scores}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
