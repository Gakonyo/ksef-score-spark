
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Project } from './AdminDashboard';

interface ProjectManagementProps {
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
}

const categories = [
  'Computer Science',
  'Biology',
  'Chemistry',
  'Physics',
  'Engineering',
  'Mathematics',
  'Environmental Science',
  'Medical Science'
];

const ProjectManagement: React.FC<ProjectManagementProps> = ({ projects, onUpdateProjects }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    presenter1: '',
    presenter2: '',
    category: ''
  });
  const { toast } = useToast();

  const handleAddProject = () => {
    if (!formData.title || !formData.presenter1 || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      title: formData.title,
      presenter1: formData.presenter1,
      presenter2: formData.presenter2,
      category: formData.category,
      createdAt: new Date().toISOString()
    };

    onUpdateProjects([...projects, newProject]);
    setFormData({ title: '', presenter1: '', presenter2: '', category: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Project Added",
      description: `${formData.title} has been added successfully`,
    });
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    onUpdateProjects(updatedProjects);
    
    toast({
      title: "Project Deleted",
      description: "Project has been removed from the system",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Project Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">Add Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <Label htmlFor="presenter1">Presenter 1 *</Label>
                  <Input
                    id="presenter1"
                    value={formData.presenter1}
                    onChange={(e) => setFormData({...formData, presenter1: e.target.value})}
                    placeholder="Enter first presenter name"
                  />
                </div>
                <div>
                  <Label htmlFor="presenter2">Presenter 2</Label>
                  <Input
                    id="presenter2"
                    value={formData.presenter2}
                    onChange={(e) => setFormData({...formData, presenter2: e.target.value})}
                    placeholder="Enter second presenter name (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddProject} className="w-full">
                  Add Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No projects added yet</p>
          ) : (
            projects.map(project => (
              <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-blue-900">{project.title}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Presenter 1:</span> {project.presenter1}
                      </p>
                      {project.presenter2 && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Presenter 2:</span> {project.presenter2}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Added:</span> {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{project.category}</Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectManagement;
