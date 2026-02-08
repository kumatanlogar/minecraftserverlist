import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, Search, Filter } from 'lucide-react';

interface NotificationLog {
  id: string;
  title: string;
  message: string;
  category: string;
  created_at: string;
  admin_id: string;
  recipient_id: string;
  profiles: {
    username: string;
    email: string;
  };
}

const categoryColors = {
  normal: 'bg-blue-500',
  danger: 'bg-red-500',
  warning: 'bg-yellow-500',
  success: 'bg-green-500',
  server_listing: 'bg-purple-500',
};

const categoryLabels = {
  normal: 'Normal',
  danger: 'Danger',
  warning: 'Warning',
  success: 'Success',
  server_listing: 'Server Listing',
};

export function NotificationLogs() {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<NotificationLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(log =>
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    setFilteredLogs(filtered);
  }, [searchQuery, categoryFilter, logs]);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_logs')
        .select(`
          *,
          profiles!notification_logs_recipient_id_fkey(username, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      if (data) {
        setLogs(data as any);
        setFilteredLogs(data as any);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading logs...</div>;
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Notification Logs
        </CardTitle>
        <CardDescription>History of all sent notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="danger">Danger</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="server_listing">Server Listing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>

        <ScrollArea className="h-[500px] rounded-md border">
          <div className="p-4 space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No logs found
              </div>
            ) : (
              filteredLogs.map(log => (
                <div
                  key={log.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            categoryColors[log.category as keyof typeof categoryColors]
                          }`}
                        />
                        <span className="font-semibold">{log.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {categoryLabels[log.category as keyof typeof categoryLabels]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <span>To: {log.profiles?.username || 'Unknown'}</span>
                      <span>{log.profiles?.email}</span>
                    </div>
                    <span>
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
