import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ServerIcon, ArrowRight, ArrowLeft, CheckCircle, Image as ImageIcon, Globe, MessageSquare, Eye } from 'lucide-react';
import { z } from 'zod';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet';

const serverSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  ip: z.string().min(3, 'IP address is required'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(200),
  long_description: z.string().min(50, 'Long description must be at least 50 characters').max(2000),
  version: z.string().min(1, 'Version is required'),
  country: z.string().min(2, 'Country is required'),
  tags: z.string(),
  website: z.string().url().optional().or(z.literal('')),
  discord: z.string().optional(),
  max_players: z.number().min(1).max(100000),
  banner_url: z.string().url('Banner URL must be a valid URL'),
  logo_url: z.string().url().optional().or(z.literal(''))
});

export default function SubmitServer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    version: '',
    country: '',
    description: '',
    long_description: '',
    banner_url: '',
    logo_url: '',
    tags: '',
    website: '',
    discord: '',
    max_players: 100
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const checkServerAPI = async (ip: string) => {
    try {
      const response = await fetch(`https://api.mcsrvstat.us/3/${ip}`);
      const data = await response.json();
      if (data.online && data.players?.max) {
        updateField('max_players', data.players.max);
        toast({
          title: "Server Info Retrieved",
          description: `Auto-filled: ${data.players.max} max players`,
        });
      }
    } catch (error) {
      console.error('Failed to fetch server info:', error);
    }
  };

  useEffect(() => {
    if (formData.ip && formData.ip.length > 3) {
      const timer = setTimeout(() => {
        checkServerAPI(formData.ip);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.ip]);

  const handleSubmit = async () => {
    setIsLoading(true);

    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    
    try {
      serverSchema.parse({
        ...formData,
        max_players: Number(formData.max_players)
      });

      const { error } = await supabase
        .from('servers')
        .insert({
          owner_id: user?.id,
          name: formData.name,
          ip: formData.ip,
          description: formData.description,
          long_description: formData.long_description,
          version: formData.version,
          country: formData.country,
          tags,
          website: formData.website || null,
          discord: formData.discord || null,
          max_players: Number(formData.max_players),
          banner_url: formData.banner_url,
          logo_url: formData.logo_url || null,
          status: 'approved'
        });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message
        });
      } else {
        toast({
          title: "Success!",
          description: "Your server has been added and is now live!",
          duration: 5000
        });
        navigate('/dashboard');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: error.errors[0].message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const progress = (step / 3) * 100;

  return (
    <>
      <Helmet>
        <title>Add Your Server - MC Vault | List Your Minecraft Server</title>
        <meta name="description" content="Add your Minecraft server to MC Vault. Share your server with thousands of players and grow your community. Quick and easy setup!" />
        <meta name="keywords" content="add minecraft server, list server, minecraft server hosting, server submission" />
        <link rel="canonical" href={`${window.location.origin}/submit-server`} />
        <meta property="og:title" content="Add Your Server - MC Vault" />
        <meta property="og:description" content="List your Minecraft server on MC Vault" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://i.ytimg.com/vi/XuVQZ-IwifU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCTBI0ahHfgNN085T3tWdT-P-Y30g" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content="https://i.ytimg.com/vi/XuVQZ-IwifU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCTBI0ahHfgNN085T3tWdT-P-Y30g" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-primary rounded-full mb-4 shadow-glow">
              <ServerIcon className="h-12 w-12 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-foreground">
              Add Your Server
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share your Minecraft server with thousands of players. It only takes a few minutes!
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Step {step} of 3</span>
              <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'}`}>
                  {step > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
                </div>
                <span className="text-sm font-medium hidden sm:inline">Basic Info</span>
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'}`}>
                  {step > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
                </div>
                <span className="text-sm font-medium hidden sm:inline">Media</span>
              </div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'}`}>
                  3
                </div>
                <span className="text-sm font-medium hidden sm:inline">Details</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>
                    {step === 1 && 'Basic Information'}
                    {step === 2 && 'Media & Branding'}
                    {step === 3 && 'Additional Details'}
                  </CardTitle>
                  <CardDescription>
                    {step === 1 && 'Tell us about your server and how players can connect'}
                    {step === 2 && 'Add images to make your server stand out'}
                    {step === 3 && 'Add tags, links, and other information'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {step === 1 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Server Name *</Label>
                        <Input 
                          id="name" 
                          value={formData.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          placeholder="My Awesome Server" 
                          maxLength={100}
                        />
                        <p className="text-xs text-muted-foreground">{formData.name.length}/100 characters</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ip">Server IP Address *</Label>
                        <Input 
                          id="ip" 
                          value={formData.ip}
                          onChange={(e) => updateField('ip', e.target.value)}
                          placeholder="play.myserver.net or 192.168.1.1:25565"
                          className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground">Include the port if it's not default (25565)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="version">Minecraft Version *</Label>
                          <Input 
                            id="version" 
                            value={formData.version}
                            onChange={(e) => updateField('version', e.target.value)}
                            placeholder="1.20.2" 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country Code *</Label>
                          <Input 
                            id="country" 
                            value={formData.country}
                            onChange={(e) => updateField('country', e.target.value.toUpperCase())}
                            placeholder="US, UK, DE, etc." 
                            maxLength={2}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Short Description * (10-200 chars)</Label>
                        <Textarea 
                          id="description" 
                          value={formData.description}
                          onChange={(e) => updateField('description', e.target.value)}
                          placeholder="A brief, catchy description of your server"
                          rows={3}
                          maxLength={200}
                        />
                        <p className="text-xs text-muted-foreground">{formData.description.length}/200 characters</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="long_description">Detailed Description * (50-2000 chars)</Label>
                        <Textarea 
                          id="long_description" 
                          value={formData.long_description}
                          onChange={(e) => updateField('long_description', e.target.value)}
                          placeholder="Tell players more about your server: features, community, gameplay, unique aspects..."
                          rows={6}
                          maxLength={2000}
                        />
                        <p className="text-xs text-muted-foreground">{formData.long_description.length}/2000 characters</p>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="banner_url">Banner Image URL *</Label>
                        <Input 
                          id="banner_url" 
                          value={formData.banner_url}
                          onChange={(e) => updateField('banner_url', e.target.value)}
                          type="url" 
                          placeholder="https://example.com/banner.jpg"
                        />
                        <p className="text-xs text-muted-foreground">
                          📏 Recommended size: 1200x400px • Displays at the top of your server page
                        </p>
                        {formData.banner_url && (
                          <div className="mt-2 border border-border rounded-lg overflow-hidden">
                            <img 
                              src={formData.banner_url} 
                              alt="Banner preview" 
                              className="w-full h-32 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/1200x400?text=Invalid+URL';
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="logo_url">Logo Image URL (optional)</Label>
                        <Input 
                          id="logo_url" 
                          value={formData.logo_url}
                          onChange={(e) => updateField('logo_url', e.target.value)}
                          type="url" 
                          placeholder="https://example.com/logo.png"
                        />
                        <p className="text-xs text-muted-foreground">
                          📏 Recommended size: 256x256px • Displays as your server icon
                        </p>
                        {formData.logo_url && (
                          <div className="mt-2">
                            <img 
                              src={formData.logo_url} 
                              alt="Logo preview" 
                              className="w-20 h-20 rounded-lg border border-border object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/256x256?text=Invalid+URL';
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <div className="flex items-start gap-3">
                          <ImageIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div className="space-y-2 text-sm">
                            <p className="font-medium">Image Tips:</p>
                            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                              <li>Use high-quality images for better impression</li>
                              <li>Optimize images for web (WebP or JPEG format)</li>
                              <li>Host on reliable image hosting services</li>
                              <li>Ensure images are publicly accessible</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 3: Additional Details */}
                  {step === 3 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="max_players">Maximum Players *</Label>
                        <Input 
                          id="max_players" 
                          value={formData.max_players}
                          onChange={(e) => updateField('max_players', Number(e.target.value))}
                          type="number" 
                          placeholder="100"
                          min="1"
                          max="100000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input 
                          id="tags" 
                          value={formData.tags}
                          onChange={(e) => updateField('tags', e.target.value)}
                          placeholder="Survival, PvP, Economy, Towny" 
                        />
                        <p className="text-xs text-muted-foreground">
                          💡 Suggested: Survival, Creative, PvP, Economy, Skyblock, Prison, Towny, Factions
                        </p>
                        {formData.tags && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.tags.split(',').map((tag, i) => tag.trim() && (
                              <Badge key={i} variant="secondary">{tag.trim()}</Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website (optional)</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="website" 
                            value={formData.website}
                            onChange={(e) => updateField('website', e.target.value)}
                            type="url" 
                            placeholder="https://myserver.com"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discord">Discord (optional)</Label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="discord" 
                            value={formData.discord}
                            onChange={(e) => updateField('discord', e.target.value)}
                            placeholder="discord.gg/myserver or full URL"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div className="space-y-1 text-sm">
                            <p className="font-medium text-primary">Ready to Launch!</p>
                            <p className="text-muted-foreground">
                              Your server will be published immediately and visible to all users. Make sure all information is correct!
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-2 pt-4">
                    {step > 1 && (
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}
                    {step < 3 ? (
                      <Button
                        onClick={nextStep}
                        className="flex-1 bg-gradient-primary"
                      >
                        Next Step
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 bg-gradient-primary"
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Publish Server
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview Section */}
            <div className="lg:sticky lg:top-8 h-fit">
              <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Live Preview
                  </CardTitle>
                  <CardDescription>See how your server will appear to players</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Banner Preview */}
                  <div className="relative overflow-hidden rounded-lg border border-border h-40 bg-muted/50">
                    {formData.banner_url ? (
                      <img 
                        src={formData.banner_url} 
                        alt="Banner" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/1200x400?text=Banner+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    )}
                  </div>

                  {/* Server Info Preview */}
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      {formData.logo_url ? (
                        <img 
                          src={formData.logo_url} 
                          alt="Logo" 
                          className="w-12 h-12 rounded-lg border border-border object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Logo';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg border border-border bg-muted/50 flex items-center justify-center">
                          <ServerIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-primary">
                          {formData.name || 'Your Server Name'}
                        </h3>
                        <p className="text-sm text-muted-foreground font-mono">
                          {formData.ip || 'play.yourserver.net'}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {formData.description || 'Your short server description will appear here...'}
                    </p>

                    {formData.tags && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.tags.split(',').map((tag, i) => tag.trim() && (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <p className="text-muted-foreground text-xs">Version</p>
                        <p className="font-medium">{formData.version || '1.20.2'}</p>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <p className="text-muted-foreground text-xs">Max Players</p>
                        <p className="font-medium">{formData.max_players || 100}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        </main>
      </div>
    </>
  );
}
