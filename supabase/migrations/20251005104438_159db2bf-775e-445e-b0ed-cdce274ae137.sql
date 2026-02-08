-- Create notifications table for user notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Add last_checked timestamp to servers for monitoring
ALTER TABLE public.servers ADD COLUMN IF NOT EXISTS last_checked TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.servers ADD COLUMN IF NOT EXISTS last_online TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.servers ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT true;
ALTER TABLE public.servers ADD COLUMN IF NOT EXISTS motd TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_servers_last_checked ON public.servers(last_checked);
CREATE INDEX IF NOT EXISTS idx_servers_is_online ON public.servers(is_online);