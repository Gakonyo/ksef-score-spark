
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Project, Judge, Score } from './AdminDashboard';

interface ResultsOverviewProps {
  projects: Project[];
  judges: Judge[];
  scores: Score[];
}

const ResultsOverview: React.FC<ResultsOverviewProps> = ({ projects, judges, scores }) => {
  // Calculate project rankings
  const projectResults = projects.map(project => {
    const projectScores = scores.filter(s => s.projectId === project.id);
    const averageScore = projectScores.length > 0 
      ? projectScores.reduce((sum, score) => sum + score.total, 0) / projectScores.length 
      : 0;
    
    return {
      ...project,
      scores: projectScores,
      averageScore: Math.round(averageScore * 100) / 100,
      judgeCount: projectScores.length
    };
  }).sort((a, b) => b.averageScore - a.averageScore);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-500';
      case 2: return 'bg-gray-400';
      case 3: return 'bg-amber-600';
      default: return 'bg-blue-500';
    }
  };

  const completionRate = projects.length > 0 
    ? Math.round((scores.length / (projects.length * judges.length)) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Judging Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm text-gray-600">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{scores.length}</div>
                <div className="text-sm text-gray-600">Scores Submitted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {projects.length * judges.length - scores.length}
                </div>
                <div className="text-sm text-gray-600">Pending Scores</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Date().toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">Last Updated</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectResults.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No results available yet</p>
            ) : (
              projectResults.map((project, index) => (
                <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full ${getRankColor(index + 1)} flex items-center justify-center text-white font-bold`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <p className="text-sm text-gray-600">
                          {project.presenter1}{project.presenter2 ? ` & ${project.presenter2}` : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{project.category}</Badge>
                          <span className="text-xs text-gray-500">
                            {project.judgeCount} of {judges.filter(j => j.categories.includes(project.category)).length} judges
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {project.averageScore.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500">Average Score</div>
                      {project.scores.length > 0 && (
                        <div className="text-xs text-gray-400 mt-1">
                          Last: {new Date(project.scores[project.scores.length - 1].timestamp).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {project.scores.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Individual Scores:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {project.scores.map(score => {
                          const judge = judges.find(j => j.id === score.judgeId);
                          return (
                            <div key={score.id} className="text-xs bg-gray-100 p-2 rounded">
                              <div className="font-medium">{judge?.name || 'Unknown Judge'}</div>
                              <div>S1: {score.section1} | S2: {score.section2} | S3: {score.section3}</div>
                              <div className="font-semibold">Total: {score.total}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsOverview;
