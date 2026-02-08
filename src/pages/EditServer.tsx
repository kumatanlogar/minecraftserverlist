import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function EditServer() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    description: '',
    long_description: '',
    version: '',
    country: '',
    website: '',
    discord: '',
    banner_url: '',
    custom_banner_url: '',
    tags: [] as string[],
    featured_videos: [] as string[],
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchServer();
  }, [user, id]);

  const fetchServer = async () => {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user?.id)
        .single();

      if (error) throw error;

      if (!data) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Server not found or you don't have permission to edit it"
        });
        navigate('/dashboard');
        return;
      }

      setFormData({
        name: data.name || '',
        ip: data.ip || '',
        description: data.description || '',
        long_description: data.long_description || '',
        version: data.version || '',
        country: data.country || '',
        website: data.website || '',
        discord: data.discord || '',
        banner_url: data.banner_url || '',
        custom_banner_url: data.custom_banner_url || '',
        tags: data.tags || [],
        featured_videos: data.featured_videos || [],
      });
    } catch (error: any) {
      console.error('Error fetching server:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load server information"
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.ip || !formData.description || !formData.version || !formData.country) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('servers')
        .update(formData)
        .eq('id', id)
        .eq('owner_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Server updated successfully"
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating server:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update server"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading server information...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Server - MCVault</title>
        <meta name="description" content="Edit your Minecraft server information" />
      </Helmet>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Edit Server</CardTitle>
            <CardDescription>Update your server information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Server Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Awesome Server"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip">Server IP *</Label>
                <Input
                  id="ip"
                  value={formData.ip}
                  onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                  placeholder="play.myserver.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="Brief description of your server"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long_description">Detailed Description</Label>
              <Textarea
                id="long_description"
                value={formData.long_description}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                rows={6}
                placeholder="Detailed information about your server, gameplay, features, rules, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="version">Minecraft Version *</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="1.20.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="United States"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://myserver.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discord">Discord Invite URL</Label>
                <Input
                  id="discord"
                  type="url"
                  value={formData.discord}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  placeholder="https://discord.gg/invite"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner_url">Banner Image URL</Label>
              <Input
                id="banner_url"
                type="url"
                value={formData.banner_url}
                onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                placeholder="https://example.com/banner.png"
              />
              <p className="text-xs text-muted-foreground">Recommended size: 1200x300px</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom_banner_url">Custom Banner URL</Label>
              <Input
                id="custom_banner_url"
                type="url"
                value={formData.custom_banner_url}
                onChange={(e) => setFormData({ ...formData, custom_banner_url: e.target.value })}
                placeholder="https://example.com/custom-banner.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                placeholder="survival, economy, pvp"
              />
            </div>

            <div className="space-y-2">
              <Label>Featured Videos (YouTube URLs)</Label>
              <p className="text-xs text-muted-foreground mb-2">Add up to 5 YouTube video URLs to showcase your server</p>
              {[0, 1, 2, 3, 4].map((index) => (
                <Input
                  key={index}
                  type="url"
                  value={formData.featured_videos[index] || ''}
                  onChange={(e) => {
                    const newVideos = [...formData.featured_videos];
                    if (e.target.value) {
                      newVideos[index] = e.target.value;
                    } else {
                      newVideos.splice(index, 1);
                    }
                    setFormData({ 
                      ...formData, 
                      featured_videos: newVideos.filter(Boolean)
                    });
                  }}
                  placeholder={`YouTube Video ${index + 1} URL`}
                  className="mb-2"
                />
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gradient-primary hover:opacity-90 shadow-glow"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
