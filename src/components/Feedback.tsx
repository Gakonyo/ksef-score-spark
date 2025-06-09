
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Star, Clock } from 'lucide-react';

interface FeedbackItem {
  id: string;
  message: string;
  rating: number;
  category: string;
  timestamp: string;
  anonymous: boolean;
}

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    const storedFeedback = localStorage.getItem('studentFeedback');
    if (storedFeedback) {
      setFeedbacks(JSON.parse(storedFeedback));
    } else {
      // Sample feedback data
      const sampleFeedback: FeedbackItem[] = [
        {
          id: '1',
          message: 'The past papers section is very helpful for exam preparation. Could we have more recent papers?',
          rating: 4,
          category: 'Academic Resources',
          timestamp: '2024-12-10T10:30:00Z',
          anonymous: true
        },
        {
          id: '2',
          message: 'Assignment submission process is smooth. Thank you for making it easy to use.',
          rating: 5,
          category: 'Platform Usability',
          timestamp: '2024-12-09T14:15:00Z',
          anonymous: true
        },
        {
          id: '3',
          message: 'Would love to see more interactive content and video tutorials for difficult topics.',
          rating: 3,
          category: 'Learning Materials',
          timestamp: '2024-12-08T09:45:00Z',
          anonymous: true
        }
      ];
      setFeedbacks(sampleFeedback);
      localStorage.setItem('studentFeedback', JSON.stringify(sampleFeedback));
    }
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Academic Resources': 'bg-blue-100 text-blue-800',
      'Platform Usability': 'bg-green-100 text-green-800',
      'Learning Materials': 'bg-purple-100 text-purple-800',
      'Teaching Quality': 'bg-orange-100 text-orange-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['General'];
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Student Feedback</h2>
        <div className="text-center">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-lg font-semibold">{averageRating}</span>
            <span className="text-gray-500">({feedbacks.length} reviews)</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{feedbacks.length}</p>
            <p className="text-sm text-gray-600">Total Feedback</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{averageRating}</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {feedbacks.filter(f => {
                const feedbackDate = new Date(f.timestamp);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return feedbackDate >= weekAgo;
              }).length}
            </p>
            <p className="text-sm text-gray-600">This Week</p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbacks.map(feedback => (
          <Card key={feedback.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Badge className={getCategoryColor(feedback.category)}>
                    {feedback.category}
                  </Badge>
                  {renderStars(feedback.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(feedback.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-gray-700 mb-3">{feedback.message}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  {feedback.anonymous ? 'Anonymous Student' : 'Student'}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(feedback.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {feedbacks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No feedback yet</h3>
            <p className="text-gray-500">
              Student feedback will appear here once submitted.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Feedback;
