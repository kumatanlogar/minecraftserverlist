import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Eye, Users, MousePointerClick } from 'lucide-react';

interface AnalyticsData {
  date: string;
  views: number;
  clicks: number;
  uniqueVisitors: number;
}

interface AnalyticsChartProps {
  data: AnalyticsData[];
  totalViews: number;
  totalClicks: number;
  totalVisitors: number;
}

export default function AnalyticsChart({ data, totalViews, totalClicks, totalVisitors }: AnalyticsChartProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-3xl font-bold text-primary">{totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Visitors</p>
                <p className="text-3xl font-bold text-secondary">{totalVisitors.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-3xl font-bold text-accent">{totalClicks.toLocaleString()}</p>
              </div>
              <MousePointerClick className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Server Activity (Last 30 Days)
          </CardTitle>
          <CardDescription>Track your server's views, visitors, and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
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
                dataKey="views" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Views"
              />
              <Line 
                type="monotone" 
                dataKey="uniqueVisitors" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                name="Unique Visitors"
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                name="Clicks"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Breakdown</CardTitle>
          <CardDescription>Detailed daily statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="views" fill="hsl(var(--primary))" name="Views" />
              <Bar dataKey="clicks" fill="hsl(var(--accent))" name="Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
