
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, FileText, Plus } from 'lucide-react';

interface PastPaper {
  id: string;
  title: string;
  subject: string;
  form: string;
  year: string;
  term: string;
  fileName: string;
  uploadedBy: string;
  uploadDate: string;
}

interface PastPapersProps {
  userType: 'student' | 'staff';
}

const PastPapers: React.FC<PastPapersProps> = ({ userType }) => {
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [selectedForm, setSelectedForm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    subject: '',
    form: '',
    year: '',
    term: '',
    fileName: ''
  });
  const { toast } = useToast();

  const forms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  const subjects = ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'Computer Studies'];
  const terms = ['Term 1', 'Term 2', 'Term 3'];

  useEffect(() => {
    const storedPapers = localStorage.getItem('pastPapers');
    if (storedPapers) {
      setPapers(JSON.parse(storedPapers));
    } else {
      // Sample data
      const samplePapers: PastPaper[] = [
        {
          id: '1',
          title: 'Mathematics Final Exam',
          subject: 'Mathematics',
          form: 'Form 4',
          year: '2023',
          term: 'Term 3',
          fileName: 'math_form4_2023_term3.pdf',
          uploadedBy: 'Mr. Kiprotich',
          uploadDate: '2023-11-15'
        },
        {
          id: '2',
          title: 'English Language Paper',
          subject: 'English',
          form: 'Form 3',
          year: '2023',
          term: 'Term 2',
          fileName: 'english_form3_2023_term2.pdf',
          uploadedBy: 'Ms. Wanjiku',
          uploadDate: '2023-08-20'
        }
      ];
      setPapers(samplePapers);
      localStorage.setItem('pastPapers', JSON.stringify(samplePapers));
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const handleUpload = () => {
    if (!uploadData.title || !uploadData.subject || !uploadData.form || !uploadData.year || !uploadData.term) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newPaper: PastPaper = {
      id: Date.now().toString(),
      ...uploadData,
      uploadedBy: 'Current Staff',
      uploadDate: new Date().toISOString().split('T')[0]
    };

    const updatedPapers = [...papers, newPaper];
    setPapers(updatedPapers);
    localStorage.setItem('pastPapers', JSON.stringify(updatedPapers));

    toast({
      title: "Upload Successful",
      description: "Past paper has been uploaded successfully",
    });

    setShowUploadForm(false);
    setUploadData({
      title: '',
      subject: '',
      form: '',
      year: '',
      term: '',
      fileName: ''
    });
  };

  const handleDownload = (paper: PastPaper) => {
    toast({
      title: "Download Started",
      description: `Downloading ${paper.title}`,
    });
    // In a real app, this would trigger an actual download
  };

  const filteredPapers = papers.filter(paper => {
    return (!selectedForm || paper.form === selectedForm) &&
           (!selectedSubject || paper.subject === selectedSubject);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {userType === 'staff' ? 'Manage Past Papers' : 'Past Papers'}
        </h2>
        {userType === 'staff' && (
          <Button onClick={() => setShowUploadForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Upload Past Paper
          </Button>
        )}
      </div>

      {/* Upload Form */}
      {userType === 'staff' && showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Past Paper</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Paper Title</Label>
                <Input
                  id="title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Mathematics Final Exam"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={uploadData.subject} onValueChange={(value) => setUploadData(prev => ({ ...prev, subject: value }))}>
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
                <Label htmlFor="form">Form</Label>
                <Select value={uploadData.form} onValueChange={(value) => setUploadData(prev => ({ ...prev, form: value }))}>
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
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={uploadData.year}
                  onChange={(e) => setUploadData(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="e.g., 2024"
                />
              </div>
              <div>
                <Label htmlFor="term">Term</Label>
                <Select value={uploadData.term} onValueChange={(value) => setUploadData(prev => ({ ...prev, term: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map(term => (
                      <SelectItem key={term} value={term}>{term}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file">Upload File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleUpload} className="bg-green-600 hover:bg-green-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload Paper
              </Button>
              <Button variant="outline" onClick={() => setShowUploadForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Past Papers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
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
            <div>
              <Label htmlFor="subjectFilter">Filter by Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Papers List */}
      <div className="grid gap-4">
        {filteredPapers.map(paper => (
          <Card key={paper.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{paper.title}</h3>
                    <p className="text-gray-600">{paper.subject} • {paper.form} • {paper.year} • {paper.term}</p>
                    <p className="text-sm text-gray-500">Uploaded by {paper.uploadedBy} on {paper.uploadDate}</p>
                  </div>
                </div>
                <Button onClick={() => handleDownload(paper)} className="bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No past papers found</h3>
            <p className="text-gray-500">
              {userType === 'staff' 
                ? 'Upload your first past paper to get started.' 
                : 'Check back later for new past papers.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PastPapers;
