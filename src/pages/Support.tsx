import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, HelpCircle, BookOpen, ExternalLink } from 'lucide-react';

export default function Support() {
  return (
    <>
      <Helmet>
        <title>Support | MC Vault - Help Center for Minecraft Server Owners</title>
        <meta name="description" content="Get help with MC Vault. Find answers to common questions, contact our support team, and learn how to make the most of your Minecraft server listing." />
        <meta property="og:title" content="Support | MC Vault" />
        <meta property="og:description" content="Get help and support for your MC Vault Minecraft server listing" />
        <meta property="og:image" content="https://i.ytimg.com/vi/XuVQZ-IwifU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCTBI0ahHfgNN085T3tWdT-P-Y30g" />
        <link rel="canonical" href={`${window.location.origin}/support`} />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Support Center</h1>
            <p className="text-lg text-muted-foreground">
              We're here to help! Choose the best way to get assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="hover:border-primary transition-colors">
              <CardHeader>
                <MessageCircle className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Discord Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Join our Discord server for real-time support, community discussions, and direct access to our team.
                </p>
                <Button className="w-full" onClick={() => window.open('https://discord.mcvault.org', '_blank')}>
                  Join Discord
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary transition-colors">
              <CardHeader>
                <Mail className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Send us an email for detailed inquiries, account issues, or business partnerships.
                </p>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = 'mailto:support@mcvault.org'}>
                  Email Us
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How long does server approval take?</h3>
                <p className="text-muted-foreground">
                  Most server submissions are reviewed within 24-48 hours. Premium servers receive priority review.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I edit my server listing after approval?</h3>
                <p className="text-muted-foreground">
                  Yes! Log in to your dashboard to update your server details, description, and banner at any time.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Why was my server rejected?</h3>
                <p className="text-muted-foreground">
                  Servers are rejected if they violate our guidelines, are offline during verification, or contain inaccurate information. Check your email for specific details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How do I upgrade to Premium?</h3>
                <p className="text-muted-foreground">
                  Visit our Premium page and join our Discord to purchase a premium plan. You'll receive instant activation after payment.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I have multiple server listings?</h3>
                <p className="text-muted-foreground">
                  Yes! You can list multiple servers from the same account. Each server requires separate approval.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How are online player counts calculated?</h3>
                <p className="text-muted-foreground">
                  We use real-time server pings to fetch accurate player counts directly from your Minecraft server. Updates occur automatically.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-primary/10 via-card to-primary/10">
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">More Questions?</h3>
              <p className="text-muted-foreground mb-4">
                Check out our server guidelines for detailed information about listing requirements and policies.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/guidelines'}>
                View Guidelines
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
