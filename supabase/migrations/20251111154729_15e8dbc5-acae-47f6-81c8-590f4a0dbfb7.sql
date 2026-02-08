-- Add category column to notifications table
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'normal' CHECK (category IN ('normal', 'danger', 'warning', 'success', 'server_listing'));

-- Create notification_logs table for tracking sent notifications
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) NOT NULL,
  recipient_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  category text NOT NULL DEFAULT 'normal' CHECK (category IN ('normal', 'danger', 'warning', 'success', 'server_listing')),
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all logs
CREATE POLICY "Admins can view notification logs"
ON public.notification_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can insert logs
CREATE POLICY "Admins can create notification logs"
ON public.notification_logs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON public.notification_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_logs_admin ON public.notification_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_recipient ON public.notification_logs(recipient_id);