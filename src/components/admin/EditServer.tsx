import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface EditServerProps {
  server: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditServer({ server, open, onOpenChange, onSuccess }: EditServerProps) {
  const { toast } = useToast();
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
    featured: false,
    verified: false,
    tags: [] as string[],
  });

  useEffect(() => {
    if (server) {
      setFormData({
        name: server.name || '',
        ip: server.ip || '',
        description: server.description || '',
        long_description: server.long_description || '',
        version: server.version || '',
        country: server.country || '',
        website: server.website || '',
        discord: server.discord || '',
        banner_url: server.banner_url || '',
        custom_banner_url: server.custom_banner_url || '',
        featured: server.featured || false,
        verified: server.verified || false,
        tags: server.tags || [],
      });
    }
  }, [server]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('servers')
        .update(formData)
        .eq('id', server.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Server updated successfully"
      });
      onSuccess();
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Server</DialogTitle>
          <DialogDescription>Update server information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Server Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ip">Server IP</Label>
              <Input
                id="ip"
                value={formData.ip}
                onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="long_description">Long Description</Label>
            <Textarea
              id="long_description"
              value={formData.long_description}
              onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discord">Discord</Label>
              <Input
                id="discord"
                value={formData.discord}
                onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner_url">Banner URL</Label>
            <Input
              id="banner_url"
              value={formData.banner_url}
              onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom_banner_url">Custom Banner URL</Label>
            <Input
              id="custom_banner_url"
              value={formData.custom_banner_url}
              onChange={(e) => setFormData({ ...formData, custom_banner_url: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="verified"
                checked={formData.verified}
                onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
              />
              <Label htmlFor="verified">Verified</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
