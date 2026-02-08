import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | MC Vault - Your Data Protection</title>
        <meta name="description" content="Read MC Vault's privacy policy to understand how we collect, use, and protect your personal information when using our Minecraft server listing platform." />
        <meta property="og:title" content="Privacy Policy | MC Vault" />
        <meta property="og:description" content="Learn how MC Vault protects your privacy and handles your data" />
        <meta property="og:image" content="https://i.ytimg.com/vi/XuVQZ-IwifU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCTBI0ahHfgNN085T3tWdT-P-Y30g" />
        <link rel="canonical" href={`${window.location.origin}/privacy`} />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Account Information</h3>
                  <p>When you create an account, we collect your email address, username, and password (encrypted).</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Server Information</h3>
                  <p>When you list a server, we collect server IP addresses, descriptions, banners, and other details you provide.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Usage Data</h3>
                  <p>We collect analytics data such as page views, server visits, and interaction patterns to improve our service.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>• To provide and maintain our server listing platform</p>
                <p>• To notify you about changes to our service</p>
                <p>• To provide customer support</p>
                <p>• To gather analysis or valuable information to improve our service</p>
                <p>• To monitor the usage of our service</p>
                <p>• To detect, prevent and address technical issues</p>
                <p>• To verify server authenticity and prevent fraudulent listings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Data Storage and Security</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  We use industry-standard security measures to protect your personal information. Your data is stored securely using encrypted databases and is only accessible to authorized personnel.
                </p>
                <p>
                  All passwords are encrypted using secure hashing algorithms. We never store plain-text passwords.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  We may employ third-party companies and individuals to facilitate our service ("Service Providers"), provide the service on our behalf, perform service-related tasks, or assist us in analyzing how our service is used.
                </p>
                <p>
                  These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Public Information</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Server listings, including server names, descriptions, IP addresses, and banners you upload, are publicly visible on our platform. Do not include sensitive personal information in your server listings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>You have the right to:</p>
                <p>• Access and receive a copy of your personal data</p>
                <p>• Correct inaccurate personal data</p>
                <p>• Request deletion of your personal data</p>
                <p>• Object to processing of your personal data</p>
                <p>• Request transfer of your personal data</p>
                <p>• Withdraw consent at any time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy. We will retain and use your information to the extent necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Our service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at:{' '}
                  <a href="mailto:privacy@mcvault.org" className="text-primary hover:underline">
                    privacy@mcvault.org
                  </a>
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
