
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Project, Judge, Score } from './AdminDashboard';

interface JudgeInterfaceProps {
  judge: Judge;
  projects: Project[];
  scores: Score[];
  onLogout: () => void;
  onSubmitScore: (score: Omit<Score, 'id' | 'timestamp'>) => void;
  markingEnabled: boolean;
}

const JudgeInterface: React.FC<JudgeInterfaceProps> = ({
  judge,
  projects,
  scores,
  onLogout,
  onSubmitScore,
  markingEnabled
}) => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [scoreData, setScoreData] = useState({
    section1: '',
    section2: '',
    section3: ''
  });
  const { toast } = useToast();

  // Get projects assigned to this judge or in their categories
  const availableProjects = projects.filter(project => 
    judge.categories.includes(project.category) &&
    (judge.assignedProjects.length === 0 || judge.assignedProjects.includes(project.id))
  );

  const getProjectScore = (projectId: string) => {
    return scores.find(s => s.projectId === projectId && s.judgeId === judge.id);
  };

  const handleSubmitScore = () => {
    if (!selectedProject) {
      toast({
        title: "Error",
        description: "Please select a project",
        variant: "destructive"
      });
      return;
    }

    const section1 = parseFloat(scoreData.section1);
    const section2 = parseFloat(scoreData.section2);
    const section3 = parseFloat(scoreData.section3);

    if (isNaN(section1) || isNaN(section2) || isNaN(section3)) {
      toast({
        title: "Error",
        description: "Please enter valid scores for all sections",
        variant: "destructive"
      });
      return;
    }

    if (section1 < 0 || section1 > 100 || section2 < 0 || section2 > 100 || section3 < 0 || section3 > 100) {
      toast({
        title: "Error",
        description: "Scores must be between 0 and 100",
        variant: "destructive"
      });
      return;
    }

    const total = section1 + section2 + section3;

    const newScore = {
      projectId: selectedProject,
      judgeId: judge.id,
      section1,
      section2,
      section3,
      total
    };

    onSubmitScore(newScore);
    setScoreData({ section1: '', section2: '', section3: '' });
    
    toast({
      title: "Score Submitted",
      description: "Score has been recorded successfully",
    });
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const existingScore = selectedProject ? getProjectScore(selectedProject) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Judge Panel</h1>
            <p className="text-gray-600">Welcome, {judge.name}</p>
            <div className="flex gap-2 mt-2">
              {judge.categories.map(cat => (
                <Badge key={cat} variant="secondary">{cat}</Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={markingEnabled ? "default" : "destructive"}>
              {markingEnabled ? "Marking Active" : "Marking Disabled"}
            </Badge>
            <Button onClick={onLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {!markingEnabled && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <p className="text-yellow-800">
                ⚠️ Marking is currently disabled. Please wait for the admin to enable scoring.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Available Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableProjects.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No projects assigned</p>
                ) : (
                  availableProjects.map(project => {
                    const score = getProjectScore(project.id);
                    const isSelected = selectedProject === project.id;
                    
                    return (
                      <div
                        key={project.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          isSelected ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{project.title}</h3>
                            <p className="text-sm text-gray-600">
                              {project.presenter1}{project.presenter2 ? ` & ${project.presenter2}` : ''}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {project.category}
                            </Badge>
                          </div>
                          {score && (
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {score.total}
                              </div>
                              <div className="text-xs text-gray-500">Scored</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scoring Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Score Entry</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProjectData ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900">{selectedProjectData.title}</h3>
                    <p className="text-blue-700">
                      {selectedProjectData.presenter1}
                      {selectedProjectData.presenter2 ? ` & ${selectedProjectData.presenter2}` : ''}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {selectedProjectData.category}
                    </Badge>
                  </div>

                  {existingScore && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Previous Score:</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>Section 1: {existingScore.section1}</div>
                        <div>Section 2: {existingScore.section2}</div>
                        <div>Section 3: {existingScore.section3}</div>
                      </div>
                      <div className="font-bold text-green-800 mt-2">
                        Total: {existingScore.total}
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        Submitted: {new Date(existingScore.timestamp).toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="section1">Section 1 Score (0-100)</Label>
                      <Input
                        id="section1"
                        type="number"
                        min="0"
                        max="100"
                        value={scoreData.section1}
                        onChange={(e) => setScoreData({...scoreData, section1: e.target.value})}
                        placeholder="Enter score"
                        disabled={!markingEnabled}
                      />
                    </div>
                    <div>
                      <Label htmlFor="section2">Section 2 Score (0-100)</Label>
                      <Input
                        id="section2"
                        type="number"
                        min="0"
                        max="100"
                        value={scoreData.section2}
                        onChange={(e) => setScoreData({...scoreData, section2: e.target.value})}
                        placeholder="Enter score"
                        disabled={!markingEnabled}
                      />
                    </div>
                    <div>
                      <Label htmlFor="section3">Section 3 Score (0-100)</Label>
                      <Input
                        id="section3"
                        type="number"
                        min="0"
                        max="100"
                        value={scoreData.section3}
                        onChange={(e) => setScoreData({...scoreData, section3: e.target.value})}
                        placeholder="Enter score"
                        disabled={!markingEnabled}
                      />
                    </div>

                    {scoreData.section1 && scoreData.section2 && scoreData.section3 && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-lg font-bold">
                          Total Score: {
                            (parseFloat(scoreData.section1 || '0') + 
                             parseFloat(scoreData.section2 || '0') + 
                             parseFloat(scoreData.section3 || '0')).toFixed(1)
                          }
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={handleSubmitScore} 
                      className="w-full"
                      disabled={!markingEnabled}
                    >
                      {existingScore ? 'Update Score' : 'Submit Score'}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Select a project to start scoring
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Scoring Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {availableProjects.length}
                </div>
                <div className="text-sm text-gray-600">Assigned Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {scores.filter(s => s.judgeId === judge.id).length}
                </div>
                <div className="text-sm text-gray-600">Completed Scores</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {availableProjects.length - scores.filter(s => s.judgeId === judge.id).length}
                </div>
                <div className="text-sm text-gray-600">Pending Scores</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {availableProjects.length > 0 
                    ? Math.round((scores.filter(s => s.judgeId === judge.id).length / availableProjects.length) * 100)
                    : 0
                  }%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JudgeInterface;
