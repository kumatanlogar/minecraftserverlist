import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, Search, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
}

const notificationCategories = [
  { value: 'normal', label: 'Normal Message', color: 'bg-blue-500' },
  { value: 'danger', label: 'Danger Alert', color: 'bg-red-500' },
  { value: 'warning', label: 'Warning', color: 'bg-yellow-500' },
  { value: 'success', label: 'Success', color: 'bg-green-500' },
  { value: 'server_listing', label: 'Server Listing', color: 'bg-purple-500' },
];

export function SendNotification() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('normal');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const { data } = await supabase.functions.invoke('get-users-data');
      if (data?.users) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSelectedUsers(filteredUsers.map(u => u.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in title and message"
      });
      return;
    }

    if (selectedUsers.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one user"
      });
      return;
    }

    setSending(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Send notifications to all selected users
      const notifications = selectedUsers.map(userId => ({
        user_id: userId,
        title,
        message,
        category,
        read: false
      }));

      const { error: notifError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notifError) throw notifError;

      // Log each notification
      const logs = selectedUsers.map(userId => ({
        admin_id: user?.id,
        recipient_id: userId,
        title,
        message,
        category
      }));

      const { error: logError } = await supabase
        .from('notification_logs')
        .insert(logs);

      if (logError) throw logError;

      toast({
        title: "Success",
        description: `Notification sent to ${selectedUsers.length} user(s)`
      });

      // Reset form
      setTitle('');
      setMessage('');
      setCategory('normal');
      setSelectedUsers([]);
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send notification"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Notification Form */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Notification
          </CardTitle>
          <CardDescription>Send in-app notifications to users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {notificationCategories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${cat.color}`} />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Selected Users</Label>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {selectedUsers.length} user(s) selected
            </div>
          </div>

          <Button 
            onClick={handleSend} 
            disabled={sending}
            className="w-full bg-gradient-primary"
          >
            {sending ? 'Sending...' : 'Send Notification'}
          </Button>
        </CardContent>
      </Card>

      {/* User Selection */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Recipients
          </CardTitle>
          <CardDescription>Choose users to send notification to</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
              className="flex-1"
            >
              Select All ({filteredUsers.length})
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearSelection}
              className="flex-1"
            >
              Clear
            </Button>
          </div>

          <ScrollArea className="h-[400px] rounded-md border">
            <div className="p-4 space-y-2">
              {filteredUsers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No users found
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => toggleUserSelection(user.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedUsers.includes(user.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{user.username || 'No username'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        {user.full_name && (
                          <div className="text-xs text-muted-foreground">{user.full_name}</div>
                        )}
                      </div>
                      {selectedUsers.includes(user.id) && (
                        <Badge variant="default">Selected</Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
