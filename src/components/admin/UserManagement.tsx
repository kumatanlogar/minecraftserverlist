import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Search, 
  Trash2, 
  Edit, 
  Crown, 
  Calendar,
  TrendingUp,
  UserPlus,
  Mail,
  Shield
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface UserData {
  id: string;
  username: string;
  full_name: string | null;
  created_at: string;
  is_premium: boolean;
  email?: string;
  server_count?: number;
  last_sign_in?: string;
}

export function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    premium: 0,
    free: 0,
    newThisMonth: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editForm, setEditForm] = useState({ username: '', full_name: '', is_premium: false });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(query) ||
        user.full_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users"
      });
      setLoading(false);
      return;
    }

    // Fetch server counts for each user
    const { data: serverCounts, error: serverError } = await supabase
      .from('servers')
      .select('owner_id');

    const serverCountMap = serverCounts?.reduce((acc: any, server: any) => {
      acc[server.owner_id] = (acc[server.owner_id] || 0) + 1;
      return acc;
    }, {}) || {};

    // Combine data
    const usersWithData = profiles.map(profile => ({
      ...profile,
      server_count: serverCountMap[profile.id] || 0
    }));

    setUsers(usersWithData);
    setFilteredUsers(usersWithData);

    // Calculate stats
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const totalUsers = usersWithData.length;
    const premiumUsers = usersWithData.filter((u: UserData) => u.is_premium).length;
    const newThisMonth = usersWithData.filter((u: UserData) => 
      new Date(u.created_at) >= thisMonthStart
    ).length;

    setStats({
      total: totalUsers,
      premium: premiumUsers,
      free: totalUsers - premiumUsers,
      newThisMonth
    });

    // Prepare pie chart data
    setChartData([
      { name: 'Premium', value: premiumUsers, color: 'hsl(var(--secondary))' },
      { name: 'Free', value: totalUsers - premiumUsers, color: 'hsl(var(--primary))' }
    ]);

    // Prepare growth chart (last 30 days)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const growth = last30Days.map(date => {
      const usersOnDate = usersWithData.filter((u: UserData) => 
        u.created_at?.split('T')[0] === date
      );
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: usersOnDate.length
      };
    });
    setGrowthData(growth);

    setLoading(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their servers.')) return;

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user"
      });
    } else {
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      fetchUsers();
    }
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setEditForm({
      username: user.username,
      full_name: user.full_name || '',
      is_premium: user.is_premium
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        username: editForm.username,
        full_name: editForm.full_name,
        is_premium: editForm.is_premium
      })
      .eq('id', editingUser.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user"
      });
    } else {
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      setEditingUser(null);
      fetchUsers();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All registered users</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            <Crown className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{stats.premium}</div>
            <p className="text-xs text-muted-foreground mt-1">{((stats.premium / stats.total) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Users</CardTitle>
            <Users className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.free}</div>
            <p className="text-xs text-muted-foreground mt-1">{((stats.free / stats.total) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">User growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Distribution
            </CardTitle>
            <CardDescription>Premium vs Free users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              User Growth (30 Days)
            </CardTitle>
            <CardDescription>New user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                All Users
              </CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Servers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {user.username}
                          {user.is_premium && (
                            <Crown className="h-4 w-4 text-secondary" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{user.full_name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.server_count || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_premium ? "default" : "outline"}>
                          {user.is_premium ? 'Premium' : 'Free'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                                <DialogDescription>
                                  Update user information and premium status
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="username">Username</Label>
                                  <Input
                                    id="username"
                                    value={editForm.username}
                                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="full_name">Full Name</Label>
                                  <Input
                                    id="full_name"
                                    value={editForm.full_name}
                                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="premium">Premium Status</Label>
                                  <Switch
                                    id="premium"
                                    checked={editForm.is_premium}
                                    onCheckedChange={(checked) => setEditForm({ ...editForm, is_premium: checked })}
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setEditingUser(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleSaveEdit}>
                                  Save Changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
