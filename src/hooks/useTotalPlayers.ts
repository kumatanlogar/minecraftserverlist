import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TotalPlayersData {
  totalPlayers: number;
  totalServers: number;
  isLoading: boolean;
}

export const useTotalPlayers = () => {
  const [data, setData] = useState<TotalPlayersData>({
    totalPlayers: 0,
    totalServers: 0,
    isLoading: true,
  });

  useEffect(() => {
    const fetchTotalPlayers = async () => {
      try {
        const { data: servers, error } = await supabase
          .from('servers')
          .select('ip')
          .eq('status', 'approved');

        if (error || !servers) {
          setData({ totalPlayers: 0, totalServers: 0, isLoading: false });
          return;
        }

        const statusPromises = servers.map(async (server) => {
          try {
            const response = await fetch(`https://api.mcsrvstat.us/3/${server.ip}`);
            const statusData = await response.json();
            return statusData.online ? (statusData.players?.online || 0) : 0;
          } catch {
            return 0;
          }
        });

        const playerCounts = await Promise.all(statusPromises);
        const totalPlayers = playerCounts.reduce((sum, count) => sum + count, 0);

        setData({
          totalPlayers,
          totalServers: servers.length,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error fetching total players:', error);
        setData({ totalPlayers: 0, totalServers: 0, isLoading: false });
      }
    };

    fetchTotalPlayers();
  }, []);

  return data;
};
