import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MinecraftServerStatus {
  online: boolean;
  players?: number;
  maxPlayers?: number;
  motd?: string;
  version?: string;
}

async function checkMinecraftServer(ip: string): Promise<MinecraftServerStatus> {
  try {
    const response = await fetch(`https://api.mcsrvstat.us/3/${ip}`);
    const data = await response.json();
    
    console.log(`Server ${ip} status:`, data);
    
    return {
      online: data.online || false,
      players: data.players?.online || 0,
      maxPlayers: data.players?.max || 0,
      motd: data.motd?.clean?.join(' ') || data.motd?.raw?.join(' ') || '',
      version: data.version || ''
    };
  } catch (error) {
    console.error(`Error checking server ${ip}:`, error);
    return { online: false };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: servers, error: fetchError } = await supabase
      .from('servers')
      .select('*')
      .eq('status', 'approved');

    if (fetchError) throw fetchError;

    console.log(`Checking ${servers?.length || 0} servers`);

    const now = new Date();
    const updates = [];

    for (const server of servers || []) {
      const status = await checkMinecraftServer(server.ip);
      
      const updateData: any = {
        last_checked: now.toISOString(),
        is_online: status.online,
        players: status.players || 0,
        motd: status.motd || server.motd,
      };

      if (status.online) {
        updateData.last_online = now.toISOString();
      }

      const { error: updateError } = await supabase
        .from('servers')
        .update(updateData)
        .eq('id', server.id);

      if (updateError) {
        console.error(`Error updating server ${server.id}:`, updateError);
        continue;
      }

      if (!status.online && server.last_online) {
        const lastOnline = new Date(server.last_online);
        const daysSinceOnline = Math.floor((now.getTime() - lastOnline.getTime()) / (1000 * 60 * 60 * 24));
        
        console.log(`Server ${server.name} offline for ${daysSinceOnline} days`);

        if (daysSinceOnline >= 30) {
          const { error: deleteError } = await supabase
            .from('servers')
            .delete()
            .eq('id', server.id);

          if (!deleteError) {
            await supabase
              .from('notifications')
              .insert({
                user_id: server.owner_id,
                title: 'Server Deleted - Offline Too Long',
                message: `Your server "${server.name}" has been automatically deleted as it has been offline for more than 30 days.`
              });
          }
          continue;
        }

        if (daysSinceOnline === 15) {
          await supabase
            .from('notifications')
            .insert({
              user_id: server.owner_id,
              title: 'Server Offline Warning',
              message: `Your server "${server.name}" has been offline for 15 days. It will be automatically deleted if it remains offline for 30 days.`
            });
        }
      }

      updates.push({ id: server.id, status: status.online ? 'online' : 'offline' });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        checked: servers?.length || 0,
        updates 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in check-server-status:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});