import { Navbar } from "@/components/Navbar";
import ServerCard from "@/components/ServerCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServerList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [version, setVersion] = useState("all");
  const [country, setCountry] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [minPlayers, setMinPlayers] = useState(0);

  useEffect(() => {
    fetchServers();

    const channel = supabase
      .channel('servers-list-changes')
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
    const { data } = await supabase
      .from('servers')
      .select('*, reviews(rating)')
      .eq('status', 'approved');
    
    if (data) setServers(data);
    setLoading(false);
  };

  const getAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  };

  const filteredServers = useMemo(() => {
    let filtered = [...servers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (server) =>
          server.name.toLowerCase().includes(query) ||
          server.ip.toLowerCase().includes(query) ||
          server.tags?.some((tag: string) => tag.toLowerCase().includes(query)) ||
          server.description.toLowerCase().includes(query)
      );
    }

    if (category !== "all") {
      filtered = filtered.filter((server) =>
        server.tags?.some((tag: string) => tag.toLowerCase() === category.toLowerCase())
      );
    }

    if (version !== "all") {
      filtered = filtered.filter((server) =>
        server.version.startsWith(version)
      );
    }

    if (country !== "all") {
      filtered = filtered.filter((server) => server.country === country);
    }

    if (showOnlineOnly) {
      filtered = filtered.filter((server) => server.is_online);
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter((server) => server.featured);
    }

    if (minPlayers > 0) {
      filtered = filtered.filter((server) => (server.players || 0) >= minPlayers);
    }

    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => {
          const aReviewCount = a.reviews?.length || 0;
          const bReviewCount = b.reviews?.length || 0;
          
          if (bReviewCount !== aReviewCount) {
            return bReviewCount - aReviewCount;
          }
          
          return getAverageRating(b.reviews) - getAverageRating(a.reviews);
        });
        break;
      case "players":
        filtered.sort((a, b) => (b.players || 0) - (a.players || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [servers, searchQuery, category, version, country, sortBy]);

  const resetFilters = () => {
    setCategory("all");
    setVersion("all");
    setCountry("all");
    setSortBy("rating");
    setSearchQuery("");
    setShowOnlineOnly(false);
    setShowFeaturedOnly(false);
    setMinPlayers(0);
  };

  return (
    <>
      <Helmet>
        <title>Browse All Minecraft Servers | MC Vault Server List 2025</title>
        <meta name="description" content={`Browse ${servers.length}+ Minecraft servers. Filter by version (1.20, 1.19), category (Survival, Creative, PvP), and country. Find your perfect server with live player counts!`} />
        <meta name="keywords" content="minecraft server list, minecraft servers, server browser, minecraft multiplayer, minecraft 1.20 servers, minecraft 1.19 servers, survival servers, creative servers, pvp servers, skyblock servers" />
        <link rel="canonical" href={`${window.location.origin}/servers`} />
        
        <meta property="og:title" content="All Minecraft Servers - MC Vault" />
        <meta property="og:description" content={`Browse and filter ${servers.length}+ Minecraft servers by version, category, and more`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/servers`} />
        <meta property="og:image" content="https://i.ytimg.com/vi/XuVQZ-IwifU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCTBI0ahHfgNN085T3tWdT-P-Y30g" />
        <meta property="og:site_name" content="MC Vault" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="All Minecraft Servers - MC Vault" />
        <meta name="twitter:description" content="Browse and filter Minecraft servers" />
        <meta name="twitter:image" content="https://i.ytimg.com/vi/XuVQZ-IwifU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCTBI0ahHfgNN085T3tWdT-P-Y30g" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Minecraft Server List",
            "description": "Complete list of Minecraft servers with live player counts",
            "url": `${window.location.origin}/servers`,
            "numberOfItems": servers.length
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-foreground">
                All Minecraft Servers
              </h1>
              <p className="text-muted-foreground">
                Browse through {servers.length} amazing Minecraft servers
              </p>
            </div>
            <Button 
              onClick={() => navigate('/submit-server')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Submit Server
            </Button>
          </div>
          
          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={() => {}}
            />
          </div>

          <FilterBar
            category={category}
            version={version}
            country={country}
            sortBy={sortBy}
            onCategoryChange={setCategory}
            onVersionChange={setVersion}
            onCountryChange={setCountry}
            onSortByChange={setSortBy}
            onReset={resetFilters}
          />

          <div className="flex flex-wrap gap-4 mt-4 p-4 bg-card rounded-lg border border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-foreground">Online Only</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-foreground">Featured Only</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-sm text-foreground">Min Players:</label>
              <input
                type="number"
                min="0"
                value={minPlayers}
                onChange={(e) => setMinPlayers(parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 bg-background border border-border rounded text-sm text-foreground"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading servers...</div>
        ) : (
          <>
            <div className="mb-4 text-muted-foreground">
              Showing {filteredServers.length} server{filteredServers.length !== 1 ? 's' : ''}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServers.map((server) => (
                <ServerCard 
                  key={server.id} 
                  id={server.id}
                  name={server.name}
                  ip={server.ip}
                  description={server.description}
                  players={server.players || 0}
                  maxPlayers={server.max_players || 100}
                  averageRating={getAverageRating(server.reviews)}
                  reviewCount={server.reviews?.length || 0}
                  version={server.version}
                  country={server.country}
                  tags={server.tags || []}
                  featured={server.featured || false}
                  customBannerUrl={server.custom_banner_url || server.banner_url}
                />
              ))}
            </div>
          </>
        )}

        {filteredServers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">
              No servers found matching your criteria
            </p>
            <button
              onClick={resetFilters}
              className="text-primary hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
        
        <Footer />
      </div>
    </>
  );
};

export default ServerList;
