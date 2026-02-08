import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Flame, TreePine, Info, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NetherCalculator = () => {
  const { toast } = useToast();
  const [overworldX, setOverworldX] = useState("");
  const [overworldZ, setOverworldZ] = useState("");
  const [netherX, setNetherX] = useState("");
  const [netherZ, setNetherZ] = useState("");
  const [yCoord, setYCoord] = useState("");

  const RATIO = 8;

  const calculateFromOverworld = () => {
    const x = parseFloat(overworldX);
    const z = parseFloat(overworldZ);
    if (!isNaN(x) && !isNaN(z)) {
      setNetherX(Math.floor(x / RATIO).toString());
      setNetherZ(Math.floor(z / RATIO).toString());
    }
  };

  const calculateFromNether = () => {
    const x = parseFloat(netherX);
    const z = parseFloat(netherZ);
    if (!isNaN(x) && !isNaN(z)) {
      setOverworldX(Math.floor(x * RATIO).toString());
      setOverworldZ(Math.floor(z * RATIO).toString());
    }
  };

  const copyCoordinates = (type: "overworld" | "nether") => {
    const coords = type === "overworld" 
      ? `${overworldX} ${yCoord || "~"} ${overworldZ}`
      : `${netherX} ${yCoord || "~"} ${netherZ}`;
    navigator.clipboard.writeText(coords);
    toast({
      title: "Copied!",
      description: `${type === "overworld" ? "Overworld" : "Nether"} coordinates copied to clipboard`,
    });
  };

  const clearAll = () => {
    setOverworldX("");
    setOverworldZ("");
    setNetherX("");
    setNetherZ("");
    setYCoord("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <ArrowLeftRight className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Nether Portal Calculator</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Convert coordinates between the Overworld and Nether dimensions. The Nether has an 8:1 ratio with the Overworld.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Overworld Card */}
            <Card className="border-green-500/30 bg-gradient-to-br from-green-950/20 to-background">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TreePine className="w-6 h-6 text-green-500" />
                  <CardTitle className="text-green-500">Overworld</CardTitle>
                </div>
                <CardDescription>Enter your Overworld coordinates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="overworld-x">X Coordinate</Label>
                    <Input
                      id="overworld-x"
                      type="number"
                      placeholder="0"
                      value={overworldX}
                      onChange={(e) => setOverworldX(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overworld-z">Z Coordinate</Label>
                    <Input
                      id="overworld-z"
                      type="number"
                      placeholder="0"
                      value={overworldZ}
                      onChange={(e) => setOverworldZ(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={calculateFromOverworld} 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Flame className="w-4 h-4 mr-2" />
                    Convert to Nether
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyCoordinates("overworld")}
                    disabled={!overworldX || !overworldZ}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Nether Card */}
            <Card className="border-red-500/30 bg-gradient-to-br from-red-950/20 to-background">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-red-500" />
                  <CardTitle className="text-red-500">Nether</CardTitle>
                </div>
                <CardDescription>Enter your Nether coordinates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nether-x">X Coordinate</Label>
                    <Input
                      id="nether-x"
                      type="number"
                      placeholder="0"
                      value={netherX}
                      onChange={(e) => setNetherX(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nether-z">Z Coordinate</Label>
                    <Input
                      id="nether-z"
                      type="number"
                      placeholder="0"
                      value={netherZ}
                      onChange={(e) => setNetherZ(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={calculateFromNether} 
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <TreePine className="w-4 h-4 mr-2" />
                    Convert to Overworld
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyCoordinates("nether")}
                    disabled={!netherX || !netherZ}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Y Coordinate (shared) */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 space-y-2 w-full sm:w-auto">
                  <Label htmlFor="y-coord">Y Coordinate (Height)</Label>
                  <Input
                    id="y-coord"
                    type="number"
                    placeholder="64"
                    value={yCoord}
                    onChange={(e) => setYCoord(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                <p className="text-sm text-muted-foreground flex-1">
                  Y coordinate stays the same in both dimensions. For optimal Nether portals, build at Y=15 in the Nether (below the lava ocean).
                </p>
                <Button variant="outline" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="bg-muted/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">How Nether Portals Work</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-primary">The 8:1 Ratio</h4>
                  <p className="text-sm text-muted-foreground">
                    Every block you travel in the Nether equals 8 blocks in the Overworld. This makes the Nether perfect for fast travel across your world.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Portal Linking</h4>
                  <p className="text-sm text-muted-foreground">
                    For portals to link correctly, place your Nether portal at the calculated coordinates. Portals search a 128-block radius for existing portals.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Optimal Y Level</h4>
                  <p className="text-sm text-muted-foreground">
                    In the Nether, build portals below Y=31 to avoid the lava ocean. Y=15 is recommended for safety and avoiding ghasts.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Travel Example</h4>
                  <p className="text-sm text-muted-foreground">
                    To travel 1000 blocks in the Overworld, you only need to walk 125 blocks in the Nether. Perfect for connecting distant bases!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NetherCalculator;