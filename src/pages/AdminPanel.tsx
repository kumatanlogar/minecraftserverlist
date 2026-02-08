import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/Navbar';
import { Eye, Trash2, Shield, RefreshCw, Server, Users, TrendingUp, Activity, BarChart3, Star, Globe, Search, Download, CheckCircle, XCircle, Edit, Bell, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserManagement } from '@/components/admin/UserManagement';
import { SendNotification } from '@/components/admin/SendNotification';
import { NotificationLogs } from '@/components/admin/NotificationLogs';
import { EditServer } from '@/components/admin/EditServer';

export default function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [allServers, setAllServers] = useState<any[]>([]);
  const [filteredServers, setFilteredServers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ 
    totalServers: 0, 
    totalPlayers: 0, 
    totalViews: 0, 
    onlineServers: 0,
    offlineServers: 0,
    approvedServers: 0,
    rejectedServers: 0,
    pendingServers: 0,
    featuredServers: 0,
    totalUsers: 0,
    avgPlayersPerServer: 0,
    avgViewsPerServer: 0
  });
  const [loading, setLoading] = useState(true);
  const [editingServer, setEditingServer] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access the admin panel"
      });
      navigate('/');
      return;
    }
    fetchData();
    fetchUsers();
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allServers.filter(server => 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServers(filtered);
    } else {
      setFilteredServers(allServers);
    }
  }, [searchQuery, allServers]);

  const fetchData = async () => {
    const { data: all } = await supabase
      .from('servers')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false });

    if (all) {
      setAllServers(all);
      setFilteredServers(all);
      
      const totalPlayers = all
        .filter((s: any) => s.is_online)
        .reduce((sum: number, s: any) => sum + (s.players || 0), 0);
      const totalViews = all.reduce((sum: number, s: any) => sum + (s.views || 0), 0);
      const onlineServers = all.filter((s: any) => s.is_online).length;
      const offlineServers = all.filter((s: any) => !s.is_online).length;
      const approvedServers = all.filter((s: any) => s.status === 'approved').length;
      const rejectedServers = all.filter((s: any) => s.status === 'rejected').length;
      const pendingServers = all.filter((s: any) => s.status === 'pending').length;
      const featuredServers = all.filter((s: any) => s.featured).length;
      
      setStats({
        totalServers: all.length,
        totalPlayers,
        totalViews,
        onlineServers,
        offlineServers,
        approvedServers: all.filter((s: any) => s.status === 'approved').length,
        rejectedServers: 0,
        pendingServers: 0,
        featuredServers,
        totalUsers: 0,
        avgPlayersPerServer: all.length > 0 ? Math.round(totalPlayers / onlineServers) || 0 : 0,
        avgViewsPerServer: all.length > 0 ? Math.round(totalViews / all.length) : 0
      });
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-users-data');
      
      if (error) throw error;
      if (data?.users) {
        setUsers(data.users);
        setStats(prev => ({ ...prev, totalUsers: data.users.length }));
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
    }
  };

  const updateServerStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('servers')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${status} server`
      });
    } else {
      toast({
        title: "Success",
        description: `Server ${status} successfully`
      });
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this server?')) return;
    
    const { error } = await supabase
      .from('servers')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete server"
      });
    } else {
      toast({
        title: "Success",
        description: "Server deleted successfully"
      });
      fetchData();
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('servers')
      .update({ featured: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update featured status"
      });
    } else {
      toast({
        title: "Success",
        description: `Server ${!currentStatus ? 'featured' : 'unfeatured'} successfully`
      });
      fetchData();
    }
  };

  const refreshServerStatus = async () => {
    try {
      const { error } = await supabase.functions.invoke('check-server-status');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Server statuses updated"
      });
      fetchData();
    } catch (error: any) {
      console.error('Error refreshing:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh server status"
      });
    }
  };

  const exportData = () => {
    const csvData = filteredServers.map(s => ({
      Name: s.name,
      IP: s.ip,
      Status: s.status,
      Players: s.players || 0,
      Views: s.views || 0,
      Owner: s.profiles?.username || 'Unknown',
      Featured: s.featured ? 'Yes' : 'No',
      Online: s.is_online ? 'Yes' : 'No',
      Created: new Date(s.created_at).toLocaleDateString()
    }));
    
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `servers-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast({
      title: "Export Complete",
      description: "Server data has been exported to CSV"
    });
  };

  const statusChartData = [
    { name: 'Online', value: stats.onlineServers, color: 'hsl(var(--primary))' },
    { name: 'Offline', value: stats.offlineServers, color: 'hsl(var(--destructive))' },
  ];

  const approvalChartData = [
    { name: 'Approved', value: stats.approvedServers, color: 'hsl(var(--primary))' },
    { name: 'Pending', value: stats.pendingServers, color: 'hsl(var(--accent))' },
    { name: 'Rejected', value: stats.rejectedServers, color: 'hsl(var(--destructive))' },
  ];

  const serverActivityData = allServers.slice(0, 7).map(server => ({
    name: server.name.substring(0, 15),
    views: server.views || 0,
    players: server.players || 0,
  }));

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - MC Vault | Server Management</title>
        <meta name="description" content="Admin dashboard for managing Minecraft servers, monitoring analytics, and overseeing the MC Vault platform." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-primary rounded-lg shadow-glow">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
            <div>
              <h1 className="text-4xl font-bold">Admin Control Panel</h1>
              <p className="text-muted-foreground">Manage servers, users, and notifications</p>
            </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={exportData} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button onClick={refreshServerStatus} className="bg-gradient-primary shadow-glow gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Status
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-primary/30 bg-gradient-to-br from-card to-card/50 hover:shadow-glow transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Servers</CardTitle>
                  <Server className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.totalServers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.onlineServers} online • {stats.offlineServers} offline
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary/30 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Players</CardTitle>
                  <Users className="h-5 w-5 text-secondary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{stats.totalPlayers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg {stats.avgPlayersPerServer} per server
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/30 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
                  <Eye className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg {stats.avgViewsPerServer} per server
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/30 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                  <Globe className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered accounts
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card className="border-l-4 border-l-primary bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Live Servers</p>
                    <p className="text-2xl font-bold text-primary">{stats.approvedServers}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Featured</p>
                    <p className="text-2xl font-bold text-secondary">{stats.featuredServers}</p>
                  </div>
                  <Star className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Online</p>
                    <p className="text-2xl font-bold text-accent">{stats.onlineServers}</p>
                  </div>
                  <Activity className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Server Status Distribution
                </CardTitle>
                <CardDescription>Overview of online/offline and approval status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={[
                      { status: 'Online', count: stats.onlineServers },
                      { status: 'Offline', count: stats.offlineServers },
                      { status: 'Live', count: stats.approvedServers },
                      { status: 'Featured', count: stats.featuredServers }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Top Servers Activity
                </CardTitle>
                <CardDescription>Most active servers by views and players</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serverActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="views" fill="hsl(271 81% 56%)" name="Views" />
                    <Bar dataKey="players" fill="hsl(142 76% 45%)" name="Players" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Search and Tabs */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search servers by name, IP, description, or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-primary/20"
              />
            </div>
          </div>

          {/* Tabs for Servers, Users, and Notifications */}
          <Tabs defaultValue="servers" className="w-full">
            <TabsList className="grid w-full max-w-3xl grid-cols-4">
              <TabsTrigger value="servers">Servers ({filteredServers.length})</TabsTrigger>
              <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Send Notifications
              </TabsTrigger>
              <TabsTrigger value="logs">
                <History className="h-4 w-4 mr-2" />
                Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="servers" className="space-y-4 mt-6">
              {filteredServers.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No servers found matching your search</p>
                  </CardContent>
                </Card>
              ) : (
                filteredServers.map((server) => (
                  <Card key={server.id} className="border-primary/20 hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 flex-wrap mb-2">
                            {server.name}
                            {server.featured && (
                              <Badge className="bg-gradient-secondary">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {server.is_online === false && (
                              <Badge variant="destructive">Offline</Badge>
                            )}
                            {server.is_online && (
                              <Badge className="bg-primary">
                                <Activity className="h-3 w-3 mr-1" />
                                Online
                              </Badge>
                            )}
                            <Badge variant="outline" className="gap-1">
                              <Eye className="h-3 w-3" />
                              {server.views || 0}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="font-mono mb-1">
                            {server.ip}
                          </CardDescription>
                          <p className="text-xs text-muted-foreground">
                            Owner: <span className="font-medium">{server.profiles?.username || 'Unknown'}</span>
                            {server.players !== undefined && ` • ${server.players} online`}
                          </p>
                        </div>
                        <div className="flex gap-2 items-start">
                          <Badge variant="default" className="bg-primary">
                            Live
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{server.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          variant="default"
                          size="sm" 
                          onClick={() => {
                            setEditingServer(server);
                            setEditDialogOpen(true);
                          }}
                          className="bg-gradient-primary"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant={server.featured ? "outline" : "default"}
                          size="sm" 
                          onClick={() => toggleFeatured(server.id, server.featured)}
                          className={server.featured ? "" : "bg-gradient-secondary hover:opacity-90"}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          {server.featured ? 'Unfeature' : 'Feature'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/server/${server.id}`)}
                          className="hover:bg-primary/10"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(server.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="users" className="space-y-4 mt-6">
              <UserManagement />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4 mt-6">
              <SendNotification />
            </TabsContent>

            <TabsContent value="logs" className="space-y-4 mt-6">
              <NotificationLogs />
            </TabsContent>
          </Tabs>
        </main>

        {/* Edit Server Dialog */}
        {editingServer && (
          <EditServer
            server={editingServer}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={() => {
              fetchData();
              setEditDialogOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
}
