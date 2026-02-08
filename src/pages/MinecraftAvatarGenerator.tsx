import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Wand2, Images } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const MinecraftAvatarGenerator = () => {
  const [username, setUsername] = useState("Dinnerbone");
  const [loading, setLoading] = useState(false);
  const [avatars, setAvatars] = useState<any[]>([]);
  const { toast } = useToast();

  const avatarTypes = [
    {
      id: "body",
      title: "Full Body Avatar",
      description: "Complete player body with accurate skin",
      baseUrl: "https://mc-heads.net/body/",
    },
    {
      id: "face",
      title: "Face Style Avatar",
      description: "Close-up of the player's face",
      baseUrl: "https://mc-heads.net/avatar/",
    },
    {
      id: "bust",
      title: "Bust Style Avatar",
      description: "Player head and shoulders with accurate skin",
      baseUrl: "https://visage.surgeplay.com/bust/",
    },
    {
      id: "head3d",
      title: "Custom 3D Head",
      description: "3D model of the player head",
      baseUrl: "https://mc-heads.net/head/",
    },
    {
      id: "skin",
      title: "Skin Render",
      description: "High-quality skin texture render",
      baseUrl: "https://mc-heads.net/skin/",
    },
    {
      id: "combo",
      title: "Combo Avatar",
      description: "Player with equipment and items",
      baseUrl: "https://visage.surgeplay.com/combo/",
    },
  ];

  useEffect(() => {
    generateAvatars();
  }, []);

  const getImageUrl = (avatar: any, username: string) => {
    switch (avatar.id) {
      case "bust":
        return `https://visage.surgeplay.com/bust/256/${username}`;
      case "combo":
        return `https://visage.surgeplay.com/combo/256/${username}`;
      default:
        return `${avatar.baseUrl}${username}`;
    }
  };

  const getAlternativeUrl = (avatarId: string, username: string) => {
    switch (avatarId) {
      case "body":
        return `https://visage.surgeplay.com/full/512/${username}`;
      case "bust":
        return `https://mc-heads.net/bust/${username}`;
      case "face":
        return `https://visage.surgeplay.com/face/256/${username}`;
      case "head3d":
        return `https://visage.surgeplay.com/full/256/${username}`;
      case "skin":
        return `https://visage.surgeplay.com/skin/256/${username}`;
      case "combo":
        return `https://mc-heads.net/combo/${username}`;
      default:
        return `https://visage.surgeplay.com/face/256/${username}`;
    }
  };

  const generateAvatars = () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Minecraft username",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const generatedAvatars = avatarTypes.map((avatar) => ({
      ...avatar,
      imageUrl: getImageUrl(avatar, username),
      altUrl: getAlternativeUrl(avatar.id, username),
    }));
    setAvatars(generatedAvatars);
    setLoading(false);

    toast({
      title: "Success",
      description: `Successfully generated avatars for "${username}"`,
    });
  };

  const downloadAvatar = async (avatarId: string, title: string) => {
    const avatar = avatars.find((a) => a.id === avatarId);
    if (!avatar) return;

    try {
      const response = await fetch(avatar.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${username}-${avatarId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Downloaded",
        description: `${title} downloaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download avatar",
        variant: "destructive",
      });
    }
  };

  const downloadAllAvatars = async () => {
    for (const avatar of avatars) {
      await downloadAvatar(avatar.id, avatar.title);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-primary">
              Minecraft Avatar Generator
            </h1>
            <p className="text-muted-foreground">
              Generate different Minecraft avatar styles from any username
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate Avatars</CardTitle>
              <CardDescription>
                Enter a Minecraft username to generate various avatar styles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Minecraft username..."
                  onKeyPress={(e) => e.key === "Enter" && generateAvatars()}
                  className="flex-1"
                />
                <Button onClick={generateAvatars} disabled={loading}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Avatars
                </Button>
              </div>
            </CardContent>
          </Card>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Generating avatars...</p>
            </div>
          )}

          {avatars.length > 0 && !loading && (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Images className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Generated Avatars</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {avatars.map((avatar) => (
                  <Card
                    key={avatar.id}
                    className="hover:shadow-glow transition-all duration-300 hover:border-primary/50"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{avatar.title}</CardTitle>
                      <CardDescription>{avatar.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-black/20 rounded-lg p-4 flex items-center justify-center min-h-[230px]">
                        <img
                          src={avatar.imageUrl}
                          alt={`${avatar.title} for ${username}`}
                          className="max-w-full max-h-[230px] object-contain pixelated"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = avatar.altUrl;
                          }}
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                      <Button
                        onClick={() => downloadAvatar(avatar.id, avatar.title)}
                        className="w-full"
                        variant="secondary"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button onClick={downloadAllAvatars} size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download All Avatars
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MinecraftAvatarGenerator;
