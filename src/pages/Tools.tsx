import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";

const Tools = () => {
  const tools = [
    {
      title: "Minecraft Give Command Generator",
      description: "A powerful and simple to use minecraft give command maker, with enchantments, color name text, lore and advanced attributes.",
      link: "/tools/give-command-generator",
      icon: "⛏️"
    },
    {
      title: "Small Uppercase Font Generator",
      description: "Convert your text into small uppercase letters for Minecraft usernames, signs, and chat messages.",
      link: "/tools/small-uppercase-generator",
      icon: "ᴀᴀ"
    },
    {
      title: "Minecraft Color Code Generator",
      description: "Create colorful text with formatting codes for Minecraft signs, books, chat, and MOTD messages.",
      link: "/tools/color-code-generator",
      icon: "🎨"
    },
    {
      title: "Minecraft Avatar Generator",
      description: "Generate different Minecraft avatar styles from any username with multiple render options.",
      link: "/tools/avatar-generator",
      icon: "👤"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Minecraft Tools</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Useful tools and generators for Minecraft server owners and players.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link key={tool.title} to={tool.link}>
                <Card className="h-full hover:shadow-glow transition-all duration-300 hover:border-primary/50">
                  <CardHeader>
                    <div className="text-4xl mb-2">{tool.icon}</div>
                    <CardTitle>{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-primary text-sm font-medium">Open Tool →</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tools;
