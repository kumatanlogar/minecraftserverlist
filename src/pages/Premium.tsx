import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Check, Star, Zap, Shield, TrendingUp, ExternalLink } from 'lucide-react';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';

const DISCORD_INVITE = "https://discord.mcvault.org";

export default function Premium() {
  const handlePurchase = () => {
    window.open(DISCORD_INVITE, '_blank');
  };


  return (
    <>
      <Helmet>
        <title>Premium Plans | MC Vault - Boost Your Minecraft Server</title>
        <meta name="description" content="Upgrade to MC Vault Premium for featured placement, custom banners, advanced analytics, priority support, and more. Attract more players to your Minecraft server." />
        <meta property="og:title" content="Premium Plans | MC Vault" />
        <meta property="og:description" content="Boost your Minecraft server's visibility with MC Vault Premium" />
        <meta property="og:image" content="https://i.ytimg.com/vi/XuVQZ-IwifU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCTBI0ahHfgNN085T3tWdT-P-Y30g" />
        <link rel="canonical" href={`${window.location.origin}/premium`} />
      </Helmet>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Crown className="h-16 w-16 text-amber-500" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Premium Plans
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Boost your server's visibility and unlock powerful features to attract more players
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose Premium Plan?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 p-3 bg-amber-500/20 rounded-full w-16 h-16 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Guaranteed Growth</h3>
                  <p className="text-muted-foreground">See measurable increases in your player count within the first week</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 p-3 bg-amber-500/20 rounded-full w-16 h-16 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Instant Activation</h3>
                  <p className="text-muted-foreground">Your premium features activate immediately after purchase</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 p-3 bg-amber-500/20 rounded-full w-16 h-16 flex items-center justify-center">
                    <Star className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Proven Results</h3>
                  <p className="text-muted-foreground">95% of our premium users see significant growth in 30 days</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-4">Premium Plan</h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Everything you need to dominate the Minecraft server landscape
            </p>
            <div className="max-w-xl mx-auto">
              <Card className="relative border-2 border-amber-500 shadow-2xl shadow-amber-500/30">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    BEST VALUE
                  </span>
                </div>
                <CardHeader className="text-center pb-8 pt-12">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-full w-20 h-20 flex items-center justify-center">
                    <Crown className="h-10 w-10 text-amber-500" />
                  </div>
                  <CardTitle className="text-3xl mb-6">Premium Plan</CardTitle>
                  <div className="mb-6">
                    <span className="text-6xl font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent">$100</span>
                    <span className="text-muted-foreground text-lg">/month</span>
                  </div>
                  <CardDescription className="text-base">
                    Everything you need to dominate the Minecraft server landscape
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <div className="p-1 bg-amber-500/20 rounded-full">
                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      </div>
                      <div>
                        <span className="font-semibold">Server slot on top of the main page</span>
                        <p className="text-sm text-muted-foreground">Get maximum visibility with premium placement at the top of our server directory</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-1 bg-amber-500/20 rounded-full">
                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      </div>
                      <div>
                        <span className="font-semibold">Priority search placement</span>
                        <p className="text-sm text-muted-foreground">Your server will be displayed at the top of all relevant search results</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-1 bg-amber-500/20 rounded-full">
                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      </div>
                      <div>
                        <span className="font-semibold">24/7 premium support</span>
                        <p className="text-sm text-muted-foreground">Get instant help from our dedicated support team whenever you need it</p>
                      </div>
                    </li>
                  </ul>
                  <Button 
                    onClick={handlePurchase}
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 text-black font-bold text-lg shadow-lg shadow-amber-500/30"
                  >
                    Get Premium Plan Now
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Cancel anytime • No hidden fees • Instant activation
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-amber-950/30 via-card to-amber-950/30 border-amber-500/30">
            <CardContent className="text-center py-12">
              <h3 className="text-3xl font-bold mb-4">Ready to Grow Your Server?</h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our Discord community to purchase your premium plan and get started with exclusive benefits today!
              </p>
              <Button 
                size="lg" 
                onClick={handlePurchase}
                className="bg-amber-500 hover:bg-amber-600 text-black text-lg px-8"
              >
                Join Discord & Purchase
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
