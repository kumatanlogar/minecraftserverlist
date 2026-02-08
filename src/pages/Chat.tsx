import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Send, Shield, Loader2, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
  user_roles?: Array<{
    role: string;
  }>;
}

const Chat = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        async (payload) => {
          const newMsg = payload.new as ChatMessage;
          
          // Fetch profile and role info for the new message
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', newMsg.user_id)
            .single();

          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', newMsg.user_id);

          // Add cache-busting to avatar URL
          const profileWithCacheBustedAvatar = profile ? {
            ...profile,
            avatar_url: profile.avatar_url ? `${profile.avatar_url}?t=${Date.now()}` : undefined
          } : undefined;

          setMessages(prev => [...prev, {
            ...newMsg,
            profiles: profileWithCacheBustedAvatar,
            user_roles: roles || []
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data: messagesData, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      
      // Fetch profiles and roles for each message
      const enrichedMessages = await Promise.all(
        (messagesData || []).map(async (msg) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', msg.user_id)
            .single();

          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', msg.user_id);

          // Add cache-busting to avatar URL
          const profileWithCacheBustedAvatar = profile ? {
            ...profile,
            avatar_url: profile.avatar_url ? `${profile.avatar_url}?t=${Date.now()}` : undefined
          } : undefined;

          return {
            ...msg,
            profiles: profileWithCacheBustedAvatar,
            user_roles: roles || []
          };
        })
      );
      
      setMessages(enrichedMessages);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    try {
      setSending(true);
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: newMessage.trim()
        });

      if (error) {
        // Check if it's a link blocking error
        if (error.message && error.message.includes('Links are not allowed')) {
          toast({
            title: 'Links Not Allowed',
            description: 'Only administrators can post links in the chat.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return;
      }
      
      setNewMessage('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const isAdmin = (msg: ChatMessage) => {
    return msg.user_roles?.some(r => r.role === 'admin');
  };

  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Community Chat | MC Vault - Connect with Minecraft Players</title>
        <meta name="description" content="Join the MC Vault community chat to connect with Minecraft server owners and players worldwide. Share tips, find servers, and build your community." />
        <meta property="og:title" content="Community Chat | MC Vault" />
        <meta property="og:description" content="Connect with Minecraft players and server owners in real-time" />
        <link rel="canonical" href={`${window.location.origin}/chat`} />
      </Helmet>

      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Community Chat</h1>
                <p className="text-muted-foreground">Connect with the Minecraft community in real-time</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border shadow-lg overflow-hidden flex flex-col h-[calc(100vh-300px)]">
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No messages yet. Be the first to say something!
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3 group hover:bg-accent/5 p-2 rounded-lg transition-colors">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={msg.profiles?.avatar_url} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {msg.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-semibold text-foreground ${isAdmin(msg) ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`}>
                            {msg.profiles?.username || 'Unknown User'}
                          </span>
                          
                          {isAdmin(msg) && (
                            <Badge className="flex items-center gap-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-full px-2 py-0.5 border-none">
                              <Shield className="h-3 w-3" />
                              Administrator
                            </Badge>
                          )}
                          
                          <span className="text-xs text-muted-foreground">
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                        
                        <p className="text-foreground break-words whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            <form onSubmit={sendMessage} className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={sending}
                  maxLength={500}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || sending}
                  size="icon"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {newMessage.length}/500 characters
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chat;