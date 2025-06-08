
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Judge, Project } from './AdminDashboard';

interface JudgeManagementProps {
  judges: Judge[];
  projects: Project[];
  onUpdateJudges: (judges: Judge[]) => void;
}

const JudgeManagement: React.FC<JudgeManagementProps> = ({ judges, projects, onUpdateJudges }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categories: [] as string[],
    assignedProjects: [] as string[]
  });
  const { toast } = useToast();

  const categories = Array.from(new Set(projects.map(p => p.category)));

  const handleAddJudge = () => {
    if (!formData.name || formData.categories.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in judge name and select at least one category",
        variant: "destructive"
      });
      return;
    }

    const newJudge: Judge = {
      id: Date.now().toString(),
      name: formData.name,
      categories: formData.categories,
      assignedProjects: formData.assignedProjects
    };

    onUpdateJudges([...judges, newJudge]);
    setFormData({ name: '', categories: [], assignedProjects: [] });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Judge Added",
      description: `${formData.name} has been added successfully`,
    });
  };

  const handleDeleteJudge = (judgeId: string) => {
    const updatedJudges = judges.filter(j => j.id !== judgeId);
    onUpdateJudges(updatedJudges);
    
    toast({
      title: "Judge Removed",
      description: "Judge has been removed from the system",
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        categories: [...formData.categories, category]
      });
    } else {
      setFormData({
        ...formData,
        categories: formData.categories.filter(c => c !== category)
      });
    }
  };

  const handleProjectAssignment = (projectId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        assignedProjects: [...formData.assignedProjects, projectId]
      });
    } else {
      setFormData({
        ...formData,
        assignedProjects: formData.assignedProjects.filter(p => p !== projectId)
      });
    }
  };

  const getProjectsInCategories = () => {
    return projects.filter(p => formData.categories.includes(p.category));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Judge Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">Add Judge</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Judge</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="judgeName">Judge Name *</Label>
                  <Input
                    id="judgeName"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter judge name"
                  />
                </div>
                
                <div>
                  <Label>Categories *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${category}`}
                          checked={formData.categories.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                        />
                        <Label htmlFor={`cat-${category}`} className="text-sm">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.categories.length > 0 && (
                  <div>
                    <Label>Assign Projects (Optional)</Label>
                    <div className="max-h-40 overflow-y-auto mt-2 space-y-2">
                      {getProjectsInCategories().map(project => (
                        <div key={project.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`proj-${project.id}`}
                            checked={formData.assignedProjects.includes(project.id)}
                            onCheckedChange={(checked) => handleProjectAssignment(project.id, checked as boolean)}
                          />
                          <Label htmlFor={`proj-${project.id}`} className="text-sm">
                            {project.title} ({project.category})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={handleAddJudge} className="w-full">
                  Add Judge
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {judges.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No judges added yet</p>
          ) : (
            judges.map(judge => (
              <div key={judge.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-green-800">{judge.name}</h3>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Categories: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {judge.categories.map(cat => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Assigned Projects: {judge.assignedProjects.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteJudge(judge.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JudgeManagement;
