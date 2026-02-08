import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Eye, Users, Server, Star, Activity, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardServer {
  id: string;
  name: string;
  ip: string;
  status: string;
  players: number;
  created_at: string;
  views: number;
  featured: boolean;
  review_count?: number;
  average_rating?: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [servers, setServers] = useState<DashboardServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    total: 0, 
    approved: 0, 
    pending: 0, 
    featured: 0,
    totalPlayers: 0,
    totalViews: 0,
    avgRating: 0,
    totalReviews: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchServers();
  }, [user, navigate]);

  const fetchServers = async () => {
    const { data, error } = await supabase
      .from('servers')
      .select(`
        id, name, ip, status, players, created_at, views, featured,
        reviews (rating)
      `)
      .eq('owner_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your servers"
      });
    } else if (data) {
      const serversWithStats = data.map((server: any) => ({
        ...server,
        review_count: server.reviews?.length || 0,
        average_rating: server.reviews?.length 
          ? server.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / server.reviews.length 
          : 0
      }));
      
      setServers(serversWithStats);
      
      const totalPlayers = data.reduce((acc, s: any) => acc + (s.players || 0), 0);
      const totalViews = data.reduce((acc, s: any) => acc + (s.views || 0), 0);
      const allReviews = data.flatMap((s: any) => s.reviews || []);
      const avgRating = allReviews.length > 0 
        ? allReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / allReviews.length 
        : 0;

      setStats({
        total: data.length,
        approved: data.filter((s: any) => s.status === 'approved').length,
        pending: 0,
        featured: data.filter((s: any) => s.featured).length,
        totalPlayers,
        totalViews,
        avgRating,
        totalReviews: allReviews.length
      });

      const statusChart = [
        { name: 'Live', value: data.filter((s: any) => s.status === 'approved').length, color: 'hsl(var(--primary))' }
      ];
      setChartData(statusChart);

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const activity = last7Days.map(date => {
        const serversOnDate = data.filter((s: any) => 
          s.created_at?.split('T')[0] === date
        );
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          servers: serversOnDate.length,
          views: serversOnDate.reduce((acc, s: any) => acc + (s.views || 0), 0)
        };
      });
      setActivityData(activity);
    }
    setLoading(false);
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
      fetchServers();
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const copyIP = (ip: string) => {
    navigator.clipboard.writeText(ip);
    toast({
      title: "Copied!",
      description: "Server IP copied to clipboard"
    });
  };

  return (
    <>
      <Helmet>
        <title>My Dashboard - MC Vault | Manage Your Minecraft Servers</title>
        <meta name="description" content="Manage your Minecraft servers, track statistics, monitor performance, and view detailed analytics for all your listed servers on MC Vault." />
        <meta name="keywords" content="minecraft server dashboard, server management, minecraft analytics, server statistics" />
        <link rel="canonical" href={`${window.location.origin}/dashboard`} />
        <meta property="og:title" content="My Dashboard - MC Vault" />
        <meta property="og:description" content="Manage your Minecraft servers and track performance" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/dashboard`} />
        <meta property="og:image" content="https://i.ytimg.com/vi/XuVQZ-IwifU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCTBI0ahHfgNN085T3tWdT-P-Y30g" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My Dashboard - MC Vault" />
        <meta name="twitter:description" content="Manage your Minecraft servers and track performance" />
        <meta name="twitter:image" content="https://i.ytimg.com/vi/XuVQZ-IwifU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCTBI0ahHfgNN085T3tWdT-P-Y30g" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <Navbar />
      
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Server Dashboard</h1>
              <p className="text-muted-foreground">Track performance and manage your servers</p>
            </div>
            <Button asChild className="bg-gradient-primary hover:opacity-90 shadow-glow">
              <Link to="/submit-server">
                <Plus className="mr-2 h-4 w-4" />
                Add New Server
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
                <Server className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">All your servers</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Players</CardTitle>
                <Users className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{stats.totalPlayers}</div>
                <p className="text-xs text-muted-foreground mt-1">Active players</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{stats.totalViews}</div>
                <p className="text-xs text-muted-foreground mt-1">Profile views</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <Star className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{stats.avgRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground mt-1">{stats.totalReviews} reviews</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <Card className="border-l-2 border-l-primary">
              <CardHeader className="pb-1 pt-3 px-3">
                <CardTitle className="text-xs font-medium flex items-center gap-1">
                  <Activity className="h-3 w-3 text-primary" />
                  Live Servers
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 px-3">
                <div className="text-xl font-bold">{stats.approved}</div>
              </CardContent>
            </Card>

            <Card className="border-l-2 border-l-accent">
              <CardHeader className="pb-1 pt-3 px-3">
                <CardTitle className="text-xs font-medium flex items-center gap-1">
                  <Copy className="h-3 w-3 text-accent" />
                  IP Copies
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 px-3">
                <div className="text-xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card className="border-l-2 border-l-secondary">
              <CardHeader className="pb-1 pt-3 px-3">
                <CardTitle className="text-xs font-medium flex items-center gap-1">
                  <Star className="h-3 w-3 text-secondary" />
                  Featured
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 px-3">
                <div className="text-xl font-bold">{stats.featured}</div>
              </CardContent>
            </Card>
          </div>

          {servers.length > 0 && (
            <div className="grid grid-cols-1 gap-6 mb-8">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-secondary" />
                    Recent Activity (7 Days)
                  </CardTitle>
                  <CardDescription>Server submissions and views</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="servers" fill="hsl(var(--primary))" name="New Servers" />
                      <Bar dataKey="views" fill="hsl(var(--secondary))" name="Views" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 mb-8">
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-secondary" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Featured Rate:</span>
                    <span className="font-semibold">{stats.total > 0 ? ((stats.featured / stats.total) * 100).toFixed(1) : 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Servers</h2>
            </div>

            {servers.length === 0 ? (
              <Card className="border-dashed border-2 border-primary/30">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-primary/10 p-6 mb-6">
                    <Server className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">No servers listed yet</h3>
                  <p className="text-muted-foreground mb-6 text-center max-w-sm">
                    List your first Minecraft server and start building your community
                  </p>
                  <Button asChild size="lg" className="bg-gradient-primary shadow-glow">
                    <Link to="/submit-server">
                      <Plus className="mr-2 h-5 w-5" />
                      Add Your First Server
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {servers.map((server) => (
                  <Card key={server.id} className="border-primary/20 hover:shadow-lg transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {server.name}
                            </CardTitle>
                            <Badge 
                              variant={
                                server.status === 'approved' ? 'default' : 
                                server.status === 'pending' ? 'secondary' : 
                                'destructive'
                              }
                              className="capitalize"
                            >
                              {server.status}
                            </Badge>
                            {server.featured && (
                              <Badge className="bg-gradient-secondary">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CardDescription className="font-mono">{server.ip}</CardDescription>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2"
                              onClick={() => copyIP(server.ip)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild className="hover:bg-primary/10">
                            <Link to={`/server/${server.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild className="hover:bg-secondary/10">
                            <Link to={`/edit-server/${server.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(server.id)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{server.players || 0}</p>
                            <p className="text-xs text-muted-foreground">Players</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-secondary" />
                          <div>
                            <p className="text-sm font-medium">{server.views || 0}</p>
                            <p className="text-xs text-muted-foreground">Views</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <div>
                            <p className="text-sm font-medium">
                              {server.average_rating?.toFixed(1) || '0.0'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {server.review_count} reviews
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-accent" />
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(server.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">Created</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
