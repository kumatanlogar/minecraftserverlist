import { useState, useEffect } from 'react';

interface ServerStatus {
  online: boolean;
  players: number;
  maxPlayers: number;
  isLoading: boolean;
}

export const useServerStatus = (serverIp: string) => {
  const [status, setStatus] = useState<ServerStatus>({
    online: false,
    players: 0,
    maxPlayers: 0,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;

    const fetchServerStatus = async (retryCount = 0) => {
      try {
        const response = await fetch(`https://api.mcsrvstat.us/3/${serverIp}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        if (isMounted) {
          if (!data.online && retryCount < 2) {
            retryTimeout = setTimeout(() => fetchServerStatus(retryCount + 1), 2000);
            return;
          }

          setStatus({
            online: data.online || false,
            players: data.players?.online || 0,
            maxPlayers: data.players?.max || 0,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error(`Error fetching status for ${serverIp}:`, error);
        
        if (isMounted && retryCount < 2) {
          retryTimeout = setTimeout(() => fetchServerStatus(retryCount + 1), 2000);
        } else if (isMounted) {
          setStatus({
            online: false,
            players: 0,
            maxPlayers: 0,
            isLoading: false,
          });
        }
      }
    };

    fetchServerStatus();

    return () => {
      isMounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [serverIp]);

  return status;
};
