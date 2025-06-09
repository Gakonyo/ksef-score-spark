
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, Calendar, Clock, FileText, Plus, CheckCircle } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  form: string;
  deadline: string;
  attachmentName?: string;
  createdBy: string;
  createdDate: string;
  submissions?: Submission[];
}

interface Submission {
  id: string;
  studentId: string;
  fileName: string;
  submissionDate: string;
  status: 'submitted' | 'late';
}

interface AssignmentsProps {
  userType: 'student' | 'staff';
}

const Assignments: React.FC<AssignmentsProps> = ({ userType }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedForm, setSelectedForm] = useState('');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subject: '',
    form: '',
    deadline: '',
    attachmentName: ''
  });
  const { toast } = useToast();

  const forms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  const subjects = ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'Computer Studies'];

  useEffect(() => {
    const storedAssignments = localStorage.getItem('assignments');
    if (storedAssignments) {
      setAssignments(JSON.parse(storedAssignments));
    } else {
      // Sample data
      const sampleAssignments: Assignment[] = [
        {
          id: '1',
          title: 'Algebra Practice Problems',
          description: 'Complete exercises 1-20 from chapter 5. Show all working steps.',
          subject: 'Mathematics',
          form: 'Form 3',
          deadline: '2024-12-20',
          createdBy: 'Mr. Kiprotich',
          createdDate: '2024-12-01',
          submissions: []
        },
        {
          id: '2',
          title: 'Essay on Climate Change',
          description: 'Write a 500-word essay on the effects of climate change in Kenya.',
          subject: 'Geography',
          form: 'Form 4',
          deadline: '2024-12-25',
          createdBy: 'Ms. Wanjiku',
          createdDate: '2024-12-05',
          submissions: []
        }
      ];
      setAssignments(sampleAssignments);
      localStorage.setItem('assignments', JSON.stringify(sampleAssignments));
    }
  }, []);

  const handleCreateAssignment = () => {
    if (!newAssignment.title || !newAssignment.description || !newAssignment.subject || 
        !newAssignment.form || !newAssignment.deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const assignment: Assignment = {
      id: Date.now().toString(),
      ...newAssignment,
      createdBy: 'Current Staff',
      createdDate: new Date().toISOString().split('T')[0],
      submissions: []
    };

    const updatedAssignments = [...assignments, assignment];
    setAssignments(updatedAssignments);
    localStorage.setItem('assignments', JSON.stringify(updatedAssignments));

    toast({
      title: "Assignment Created",
      description: "Assignment has been created successfully",
    });

    setShowCreateForm(false);
    setNewAssignment({
      title: '',
      description: '',
      subject: '',
      form: '',
      deadline: '',
      attachmentName: ''
    });
  };

  const handleFileUpload = (assignmentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const studentAuth = localStorage.getItem('studentAuth');
      if (studentAuth) {
        const { admissionNumber } = JSON.parse(studentAuth);
        
        const submission: Submission = {
          id: Date.now().toString(),
          studentId: admissionNumber,
          fileName: file.name,
          submissionDate: new Date().toISOString(),
          status: 'submitted'
        };

        const updatedAssignments = assignments.map(assignment => {
          if (assignment.id === assignmentId) {
            const existingSubmissions = assignment.submissions || [];
            const filteredSubmissions = existingSubmissions.filter(s => s.studentId !== admissionNumber);
            return {
              ...assignment,
              submissions: [...filteredSubmissions, submission]
            };
          }
          return assignment;
        });

        setAssignments(updatedAssignments);
        localStorage.setItem('assignments', JSON.stringify(updatedAssignments));

        toast({
          title: "Assignment Submitted",
          description: "Your assignment has been submitted successfully",
        });
      }
    }
  };

  const filteredAssignments = selectedForm 
    ? assignments.filter(assignment => assignment.form === selectedForm)
    : assignments;

  const getStudentSubmission = (assignment: Assignment) => {
    const studentAuth = localStorage.getItem('studentAuth');
    if (studentAuth) {
      const { admissionNumber } = JSON.parse(studentAuth);
      return assignment.submissions?.find(s => s.studentId === admissionNumber);
    }
    return null;
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {userType === 'staff' ? 'Manage Assignments' : 'My Assignments'}
        </h2>
        {userType === 'staff' && (
          <Button onClick={() => setShowCreateForm(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        )}
      </div>

      {/* Create Assignment Form */}
      {userType === 'staff' && showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Chapter 5 Math Problems"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={newAssignment.subject} onValueChange={(value) => setNewAssignment(prev => ({ ...prev, subject: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="form">Target Form</Label>
                <Select value={newAssignment.form} onValueChange={(value) => setNewAssignment(prev => ({ ...prev, form: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    {forms.map(form => (
                      <SelectItem key={form} value={form}>{form}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newAssignment.deadline}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed instructions for the assignment..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="attachment">Attachment (Optional)</Label>
              <Input
                id="attachment"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setNewAssignment(prev => ({ ...prev, attachmentName: file.name }));
                  }
                }}
              />
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleCreateAssignment} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter for Students */}
      {userType === 'student' && (
        <Card>
          <CardHeader>
            <CardTitle>Filter Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Label htmlFor="formFilter">Filter by Form</Label>
              <Select value={selectedForm} onValueChange={setSelectedForm}>
                <SelectTrigger>
                  <SelectValue placeholder="All forms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All forms</SelectItem>
                  {forms.map(form => (
                    <SelectItem key={form} value={form}>{form}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      <div className="grid gap-4">
        {filteredAssignments.map(assignment => {
          const submission = userType === 'student' ? getStudentSubmission(assignment) : null;
          const overdue = isOverdue(assignment.deadline);
          
          return (
            <Card key={assignment.id} className={`hover:shadow-md transition-shadow ${overdue && !submission ? 'border-red-200' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{assignment.title}</h3>
                      {submission && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {overdue && !submission && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Overdue</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{assignment.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {assignment.subject}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {new Date(assignment.deadline).toLocaleDateString()}
                      </span>
                      <span>{assignment.form}</span>
                    </div>
                    {assignment.attachmentName && (
                      <p className="text-sm text-blue-600 mt-2">📎 {assignment.attachmentName}</p>
                    )}
                  </div>
                  
                  {userType === 'student' && (
                    <div className="ml-4">
                      {submission ? (
                        <div className="text-center">
                          <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg mb-2">
                            <CheckCircle className="h-5 w-5 mx-auto mb-1" />
                            <p className="text-sm font-medium">Submitted</p>
                          </div>
                          <p className="text-xs text-gray-500">{submission.fileName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(submission.submissionDate).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Label htmlFor={`file-${assignment.id}`} className="cursor-pointer">
                            <Button asChild className="bg-blue-600 hover:bg-blue-700">
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                Submit Assignment
                              </span>
                            </Button>
                          </Label>
                          <Input
                            id={`file-${assignment.id}`}
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload(assignment.id, e)}
                            accept=".pdf,.doc,.docx,.txt"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {userType === 'staff' && (
                    <div className="ml-4 text-center">
                      <div className="bg-gray-100 px-3 py-2 rounded-lg">
                        <p className="text-sm font-medium">{assignment.submissions?.length || 0} Submissions</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No assignments found</h3>
            <p className="text-gray-500">
              {userType === 'staff' 
                ? 'Create your first assignment to get started.' 
                : 'Check back later for new assignments.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Assignments;
