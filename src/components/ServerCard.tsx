import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Star, Copy, Server, Globe, Crown, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useServerStatus } from "@/hooks/useServerStatus";

interface ServerCardProps {
  id: string;
  name: string;
  ip: string;
  description: string;
  players: number;
  maxPlayers: number;
  averageRating: number;
  reviewCount: number;
  version: string;
  country: string;
  tags: string[];
  featured?: boolean;
  premiumTier?: 'starter' | 'professional' | 'enterprise' | null;
  verified?: boolean;
  customBannerUrl?: string;
}

export default function ServerCard({
  id,
  name,
  ip,
  description,
  players,
  maxPlayers,
  averageRating,
  reviewCount,
  version,
  country,
  tags,
  featured = false,
  premiumTier = null,
  verified = false,
  customBannerUrl = '',
}: ServerCardProps) {
  const liveStatus = useServerStatus(ip);
  
  const displayPlayers = liveStatus.isLoading 
    ? players 
    : liveStatus.online 
      ? liveStatus.players 
      : 0;
  
  const isOnline = liveStatus.isLoading ? (players > 0) : liveStatus.online;
  
  const copyIP = () => {
    navigator.clipboard.writeText(ip);
    toast.success("IP copied to clipboard!");
  };

  const getPremiumBadge = () => {
    if (!premiumTier) return null;
    const badges = {
      starter: { icon: Crown, label: 'PREMIUM', color: 'from-amber-600 to-amber-500' },
      professional: { icon: Crown, label: 'PRO', color: 'from-purple-600 to-purple-500' },
      enterprise: { icon: Crown, label: 'ENTERPRISE', color: 'from-blue-600 to-blue-500' }
    };
    const badge = badges[premiumTier];
    const Icon = badge.icon;
    return (
      <div className={`absolute top-0 right-0 bg-gradient-to-r ${badge.color} text-white px-4 py-1.5 text-xs font-bold rounded-bl-lg shadow-lg flex items-center gap-1 z-10`}>
        <Icon className="h-3 w-3" />
        {badge.label}
      </div>
    );
  };

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg relative ${
      featured 
        ? 'border-2 border-amber-500/50 bg-gradient-to-br from-amber-950/30 via-card to-amber-950/20 shadow-[0_0_30px_rgba(251,191,36,0.15)]' 
        : ''
    }`}>
      {getPremiumBadge()}
      <div className="w-full h-40 bg-gradient-to-r from-muted via-muted/50 to-muted overflow-hidden relative">
        {customBannerUrl ? (
          <img 
            src={customBannerUrl} 
            alt={`${name} banner`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Server className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground/50 font-mono">{ip}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              {name}
              {verified && (
                <Badge variant="default" className="bg-secondary hover:bg-secondary/90 gap-1">
                  <Shield className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className={`h-4 w-4 ${isOnline ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`font-semibold ${!isOnline ? 'text-muted-foreground' : ''}`}>
                  {liveStatus.isLoading ? (
                    <span className="text-muted-foreground">Loading...</span>
                  ) : isOnline ? (
                    `${displayPlayers} Online`
                  ) : (
                    'Offline'
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{averageRating.toFixed(1)} ({reviewCount})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Server className="h-4 w-4" />
              <span>{version}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{country}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={copyIP}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy IP
            </Button>
            <Link to={`/server/${id}`} className="flex-1">
              <Button size="sm" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}