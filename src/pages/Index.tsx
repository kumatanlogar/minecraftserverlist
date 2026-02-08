import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import ServerCard from "@/components/ServerCard";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, Play } from "lucide-react";
import heroImage from "@/assets/hero-minecraft.jpg";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { useTotalPlayers } from "@/hooks/useTotalPlayers";

interface Server {
  id: string;
  name: string;
  ip: string;
  description: string;
  players: number;
  max_players: number;
  version: string;
  country: string;
  tags: string[];
  featured: boolean;
  reviews: { rating: number }[];
}

export default function Index() {
  const [featuredServers, setFeaturedServers] = useState<Server[]>([]);
  const [topServers, setTopServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalPlayers, totalServers, isLoading: playersLoading } = useTotalPlayers();

  useEffect(() => {
    fetchServers();
    
    const channel = supabase
      .channel('servers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'servers'
        },
        () => {
          fetchServers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  const fetchServers = async () => {
    const [featured, top] = await Promise.all([
      supabase
        .from('servers')
        .select('*, reviews(rating)')
        .eq('status', 'approved')
        .eq('featured', true)
        .limit(3),
      supabase
        .from('servers')
        .select('*, reviews(rating)')
        .eq('status', 'approved')
        .order('players', { ascending: false })
        .limit(6)
    ]);

    if (featured.data) setFeaturedServers(featured.data as any);
    if (top.data) setTopServers(top.data as any);
    
    setLoading(false);
  };

  const getAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  };

  return (
    <>
      <Helmet>
        <title>MC Vault - Best Minecraft Server List | Find Top Servers 2025</title>
        <meta name="description" content="Discover the best Minecraft servers in 2025. Browse 100+ featured servers with live player counts. Join thousands of active players in survival, creative, PvP, and more!" />
        <meta name="keywords" content="minecraft servers, minecraft server list, best minecraft servers 2025, minecraft multiplayer, minecraft community, server hosting, minecraft survival, minecraft creative, minecraft pvp, top minecraft servers, mc server list, java servers, bedrock servers" />
        <link rel="canonical" href="https://mcvault.org" />
        
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="MC Vault" />
        <meta name="publisher" content="MC Vault" />
        <meta name="language" content="en" />
        <meta name="revisit-after" content="1 days" />
        <meta name="rating" content="general" />
        
        <meta property="og:title" content="MC Vault - Best Minecraft Server List 2025" />
        <meta property="og:description" content="Find and join the best Minecraft servers with thousands of active players. Live player counts and verified servers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mcvault.org" />
        <meta property="og:image" content="https://i.ytimg.com/vi/XuVQZ-IwifU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCTBI0ahHfgNN085T3tWdT-P-Y30g" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
        <meta property="og:site_name" content="MC Vault" />
        <meta property="og:locale" content="en_US" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mcvault" />
        <meta name="twitter:title" content="MC Vault - Best Minecraft Servers" />
        <meta name="twitter:description" content="Find and join the best Minecraft servers with live player counts" />
        <meta name="twitter:image" content="https://i.ytimg.com/vi/XuVQZ-IwifU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCTBI0ahHfgNN085T3tWdT-P-Y30g" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MC Vault",
            "url": "https://mcvault.org",
            "logo": "https://mcvault.org/favicon.png",
            "sameAs": []
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "MC Vault",
            "alternateName": "MC Vault - Minecraft Server List",
            "description": "The ultimate directory for finding the best Minecraft servers",
            "url": "https://mcvault.org",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://mcvault.org/servers?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Featured Minecraft Servers",
            "description": "Top featured Minecraft servers on MC Vault",
            "numberOfItems": featuredServers.length,
            "itemListElement": featuredServers.map((server, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "url": `https://mcvault.org/server/${server.id}`,
              "item": {
                "@type": "Game",
                "name": server.name,
                "description": server.description,
                "gameServer": {
                  "@type": "GameServer",
                  "playersOnline": server.players
                }
              }
            }))
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <Navbar />

      <section className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Find Your Perfect
            <span className="block text-primary">
              Minecraft Server
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in">
            Discover amazing Minecraft servers. Join the community and start your adventure today!
          </p>
          
          <div className="w-full max-w-2xl animate-fade-in">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={() => window.location.href = '/servers'}
            />
          </div>

          <div className="mt-12 flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2 px-6 py-3 bg-background/50 backdrop-blur-sm rounded-lg border border-border">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-semibold">{featuredServers.length} Featured</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-background/50 backdrop-blur-sm rounded-lg border border-border">
              <Play className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="font-semibold">
                  {playersLoading ? 'Loading...' : `${totalPlayers.toLocaleString()} Players Online`}
                </span>
                <span className="text-xs text-muted-foreground">{totalServers} Servers</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-background/50 backdrop-blur-sm rounded-lg border border-border">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-semibold">Live Player Counts</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {featuredServers.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Servers</h2>
                <p className="text-muted-foreground">Hand-picked premium servers</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServers.map((server) => (
                <ServerCard
                  key={server.id}
                  id={server.id}
                  name={server.name}
                  ip={server.ip}
                  description={server.description}
                  players={server.players}
                  maxPlayers={server.max_players}
                  averageRating={getAverageRating(server.reviews)}
                  reviewCount={server.reviews.length}
                  version={server.version}
                  country={server.country}
                  tags={server.tags}
                  featured={server.featured}
                  customBannerUrl={(server as any).custom_banner_url || (server as any).banner_url}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Top Servers</h2>
              <p className="text-muted-foreground">Most popular servers right now</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          
          {loading ? (
            <div className="text-center py-12">Loading servers...</div>
          ) : topServers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No servers available yet</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {topServers.map((server) => (
                  <ServerCard
                    key={server.id}
                    id={server.id}
                    name={server.name}
                    ip={server.ip}
                    description={server.description}
              players={server.players || 0}
              maxPlayers={server.max_players || 0}
                    averageRating={getAverageRating(server.reviews)}
                    reviewCount={server.reviews.length}
                    version={server.version}
                    country={server.country}
                    tags={server.tags}
                    featured={server.featured}
                    customBannerUrl={(server as any).custom_banner_url || (server as any).banner_url}
                  />
                ))}
              </div>
              
              <div className="text-center">
                <Button asChild size="lg">
                  <Link to="/servers">
                    View All Servers
                  </Link>
                </Button>
              </div>
            </>
          )}
        </section>
      </main>

        <Footer />
      </div>
    </>
  );
}
