
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLogin: (username: string, role: 'admin' | 'judge') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Default credentials
    if (username === 'Admin' && password === 'Admin') {
      onLogin(username, 'admin');
      toast({
        title: "Login Successful",
        description: "Welcome to KSEF Judging System",
      });
    } else if (username.startsWith('Judge') && password === 'Admin') {
      onLogin(username, 'judge');
      toast({
        title: "Login Successful",
        description: `Welcome, ${username}`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Use 'Admin/Admin' or 'Judge[X]/Admin'",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">KSEF Judging System</CardTitle>
          <CardDescription className="text-gray-600">
            Kenya Science and Engineering Fair
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-sm text-gray-500 text-center">
            <p>Default credentials:</p>
            <p>Admin: Admin/Admin</p>
            <p>Judge: Judge[X]/Admin</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
