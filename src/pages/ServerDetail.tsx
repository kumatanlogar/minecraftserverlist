import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, Users, Globe, TrendingUp, Star, Activity, Server, Flag, Clock } from "lucide-react";
import { toast } from "sonner";
import { ReviewSection } from "@/components/ReviewSection";
import { useServerStatus } from "@/hooks/useServerStatus";
import { Helmet } from "react-helmet";

const ServerDetail = () => {
  const { id } = useParams();
  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const liveStatus = useServerStatus(server?.ip || '');

  useEffect(() => {
    if (id) {
      fetchServer();
      incrementViews();
    }
  }, [id]);

  const incrementViews = async () => {
    try {
      await supabase.rpc('increment_server_views', { server_id: id });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const fetchServer = async () => {
    const { data, error } = await supabase
      .from('servers')
      .select('*, profiles(username), reviews(rating)')
      .eq('id', id)
      .single();

    if (!error && data) {
      setServer(data);
    }
    setLoading(false);
  };

  const copyIP = () => {
    if (server) {
      navigator.clipboard.writeText(server.ip);
      toast.success("IP copied to clipboard!");
    }
  };

  const averageRating = server?.reviews?.length > 0
    ? server.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / server.reviews.length
    : 0;
  
  const displayPlayers = server && !liveStatus.isLoading 
    ? (liveStatus.online && liveStatus.players > 0 ? liveStatus.players : server?.players || 0)
    : server?.players || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">Loading...</div>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Server Not Found</h1>
          <Link to="/servers">
            <Button>Back to Servers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{server.name} - Minecraft Server | MC Vault</title>
        <meta name="description" content={`${server.name} - ${server.description}. Join ${displayPlayers} players online now! IP: ${server.ip} | Version: ${server.version}`} />
        <meta name="keywords" content={`${server.name}, minecraft server, ${server.tags.join(', ')}, ${server.version}, minecraft ${server.country}`} />
        <link rel="canonical" href={`${window.location.origin}/server/${server.id}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${server.name} - Minecraft Server`} />
        <meta property="og:description" content={`${server.description}. ${displayPlayers} players online!`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/server/${server.id}`} />
        <meta property="og:site_name" content="MC Vault" />
        {server.banner_url && <meta property="og:image" content={server.banner_url} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${server.name} - Minecraft Server`} />
        <meta name="twitter:description" content={server.description} />
        {server.banner_url && <meta name="twitter:image" content={server.banner_url} />}
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Game",
            "name": server.name,
            "description": server.description,
            "aggregateRating": server.reviews.length > 0 ? {
              "@type": "AggregateRating",
              "ratingValue": averageRating.toFixed(1),
              "reviewCount": server.reviews.length,
              "bestRating": "5",
              "worstRating": "1"
            } : undefined,
            "gameServer": {
              "@type": "GameServer",
              "name": server.name,
              "playersOnline": displayPlayers,
              "serverStatus": liveStatus.online ? "Online" : "Offline"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/servers">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Servers
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Banner Image */}
            {server.banner_url && (
              <Card className="overflow-hidden">
                <img 
                  src={server.banner_url} 
                  alt={`${server.name} banner`}
                  className="w-full h-48 object-cover"
                />
              </Card>
            )}

            <Card className="p-8">
              <div className="flex items-start gap-6 mb-6">
                {server.logo_url && (
                  <img 
                    src={server.logo_url} 
                    alt={`${server.name} logo`}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-4xl font-bold text-foreground">
                      {server.name}
                    </h1>
                    {server.featured && (
                      <Badge className="bg-gradient-primary text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {server.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {server.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4 text-foreground">About This Server</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {server.long_description || server.description}
                </p>
              </div>


              {/* Featured Videos Section */}
              {server.featured_videos && server.featured_videos.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Featured Videos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {server.featured_videos.slice(0, 5).map((videoUrl: string, index: number) => {
                      // Extract YouTube video ID from URL
                      const getYouTubeId = (url: string) => {
                        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                        const match = url.match(regExp);
                        return (match && match[2].length === 11) ? match[2] : null;
                      };
                      
                      const videoId = getYouTubeId(videoUrl);
                      
                      if (!videoId) return null;
                      
                      return (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={`${server.name} - Video ${index + 1}`}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">
                  {displayPlayers}
                </div>
                <div className="text-sm text-muted-foreground">Online</div>
              </Card>
              
              <Card className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-primary fill-current" />
                <div className="text-2xl font-bold text-foreground">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </Card>
              
              <Card className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">
                  {server.uptime}
                </div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </Card>
              
              <Card className="p-4 text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold text-foreground">
                  {server.views || 0}
                </div>
                <div className="text-sm text-muted-foreground">Views</div>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Connect to Server
              </h3>
              
              <Button
                onClick={copyIP}
                className="w-full mb-6 bg-gradient-primary hover:opacity-90"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy IP: {server.ip}
              </Button>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Version
                  </span>
                  <span className="font-medium text-foreground">{server.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    Country
                  </span>
                  <span className="font-medium text-foreground">{server.country}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Uptime
                  </span>
                  <span className="font-medium text-foreground">{server.uptime}</span>
                </div>
              </div>
            </Card>

            {(server.website || server.discord) && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">Links</h3>
                <div className="space-y-2">
                  {server.website && (
                    <a
                      href={server.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full">
                        <Globe className="mr-2 h-4 w-4" />
                        Website
                      </Button>
                    </a>
                  )}
                  {server.discord && (
                    <a
                      href={`https://${server.discord}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full">
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        Discord
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-8">
          <ReviewSection serverId={id!} />
        </div>
      </div>
    </div>
    </>
  );
};

export default ServerDetail;
