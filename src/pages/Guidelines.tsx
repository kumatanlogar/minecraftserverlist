import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function Guidelines() {
  return (
    <>
      <Helmet>
        <title>Server Guidelines | MC Vault - Minecraft Server Listing Rules</title>
        <meta name="description" content="Review MC Vault's server listing guidelines and requirements. Learn what's allowed and prohibited when submitting your Minecraft server." />
        <meta property="og:title" content="Server Guidelines | MC Vault" />
        <meta property="og:description" content="Rules and guidelines for listing Minecraft servers on MC Vault" />
        <meta property="og:image" content="https://i.ytimg.com/vi/XuVQZ-IwifU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCTBI0ahHfgNN085T3tWdT-P-Y30g" />
        <link rel="canonical" href={`${window.location.origin}/guidelines`} />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Server Listing Guidelines</h1>
            <p className="text-lg text-muted-foreground">
              Follow these guidelines to ensure your server listing is approved and maintains good standing on MC Vault.
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  Allowed Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Active Minecraft Servers:</strong> Servers that are online and accessible to players.
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Accurate Information:</strong> All server details must be truthful and up-to-date.
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Original Content:</strong> Unique server descriptions and custom banners.
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Family-Friendly Servers:</strong> Servers appropriate for all ages are encouraged.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-6 w-6 text-red-500" />
                  Prohibited Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Cracked/Pirated Servers:</strong> Servers that allow unauthorized Minecraft accounts.
                  </div>
                </div>
                <div className="flex gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Illegal Content:</strong> Any content that violates laws or Minecraft's EULA.
                  </div>
                </div>
                <div className="flex gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Hate Speech:</strong> Discriminatory or offensive content targeting any group.
                  </div>
                </div>
                <div className="flex gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Spam/Duplicate Listings:</strong> Multiple listings for the same server.
                  </div>
                </div>
                <div className="flex gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>False Information:</strong> Misleading descriptions or fake player counts.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                  Listing Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Server Uptime:</strong> Servers must be online and accessible for verification.
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Description Length:</strong> Minimum 50 characters, maximum 2000 characters.
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Banner Specifications:</strong> 728x90 pixels recommended for optimal display.
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Contact Information:</strong> Valid Discord or website link for player support.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Review Process</h3>
                <p className="text-muted-foreground mb-4">
                  All server submissions are reviewed by our moderation team within 24-48 hours. Servers that violate these guidelines will be rejected or removed.
                </p>
                <p className="text-sm text-muted-foreground">
                  If you have questions about these guidelines or believe your server was incorrectly rejected, please contact our support team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
