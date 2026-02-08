import { useState, useCallback, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Copy, Plus, Trash2, Beaker, Sparkles, Clock, Zap } from "lucide-react";
import { Helmet } from "react-helmet";
import potionBottle from "@/assets/potion-bottle.png";

interface PotionEffect {
  id: string;
  effect: string;
  amplifier: number;
  duration: number;
  showParticles: boolean;
  showIcon: boolean;
}

const POTION_EFFECTS = [
  { id: "speed", name: "Speed", color: "#7CAFC6" },
  { id: "slowness", name: "Slowness", color: "#5A6C81" },
  { id: "haste", name: "Haste", color: "#D9C043" },
  { id: "mining_fatigue", name: "Mining Fatigue", color: "#4A4217" },
  { id: "strength", name: "Strength", color: "#932423" },
  { id: "instant_health", name: "Instant Health", color: "#F82423" },
  { id: "instant_damage", name: "Instant Damage", color: "#430A09" },
  { id: "jump_boost", name: "Jump Boost", color: "#22FF4C" },
  { id: "nausea", name: "Nausea", color: "#551D4A" },
  { id: "regeneration", name: "Regeneration", color: "#CD5CAB" },
  { id: "resistance", name: "Resistance", color: "#99453A" },
  { id: "fire_resistance", name: "Fire Resistance", color: "#E49A3A" },
  { id: "water_breathing", name: "Water Breathing", color: "#2E5299" },
  { id: "invisibility", name: "Invisibility", color: "#7F8392" },
  { id: "blindness", name: "Blindness", color: "#1F1F23" },
  { id: "night_vision", name: "Night Vision", color: "#1F1FA1" },
  { id: "hunger", name: "Hunger", color: "#587653" },
  { id: "weakness", name: "Weakness", color: "#484D48" },
  { id: "poison", name: "Poison", color: "#4E9331" },
  { id: "wither", name: "Wither", color: "#352A27" },
  { id: "health_boost", name: "Health Boost", color: "#F87D23" },
  { id: "absorption", name: "Absorption", color: "#2552A5" },
  { id: "saturation", name: "Saturation", color: "#F82423" },
  { id: "glowing", name: "Glowing", color: "#94A061" },
  { id: "levitation", name: "Levitation", color: "#CEFFFF" },
  { id: "luck", name: "Luck", color: "#339900" },
  { id: "unluck", name: "Bad Luck", color: "#C0A44D" },
  { id: "slow_falling", name: "Slow Falling", color: "#F7F8E0" },
  { id: "conduit_power", name: "Conduit Power", color: "#1DC2D1" },
  { id: "dolphins_grace", name: "Dolphin's Grace", color: "#88A3BE" },
  { id: "bad_omen", name: "Bad Omen", color: "#0B6138" },
  { id: "hero_of_the_village", name: "Hero of the Village", color: "#44FF44" },
  { id: "darkness", name: "Darkness", color: "#292929" },
];

const POTION_TYPES = [
  { id: "potion", name: "Potion", icon: "🧪" },
  { id: "splash_potion", name: "Splash Potion", icon: "💥" },
  { id: "lingering_potion", name: "Lingering Potion", icon: "☁️" },
  { id: "tipped_arrow", name: "Tipped Arrow", icon: "🏹" },
];

const POTION_COLORS = [
  { name: "Default", value: "default" },
  { name: "Red", value: "16711680" },
  { name: "Orange", value: "16753920" },
  { name: "Yellow", value: "16776960" },
  { name: "Lime", value: "65280" },
  { name: "Green", value: "32768" },
  { name: "Cyan", value: "65535" },
  { name: "Light Blue", value: "5636095" },
  { name: "Blue", value: "255" },
  { name: "Purple", value: "8388736" },
  { name: "Magenta", value: "16711935" },
  { name: "Pink", value: "16761035" },
  { name: "White", value: "16777215" },
  { name: "Gray", value: "8421504" },
  { name: "Black", value: "0" },
];

const PotionGenerator = () => {
  const [potionType, setPotionType] = useState("potion");
  const [potionName, setPotionName] = useState("");
  const [potionColor, setPotionColor] = useState("default");
  const [customColor, setCustomColor] = useState("#FF0000");
  const [effects, setEffects] = useState<PotionEffect[]>([]);
  const [version, setVersion] = useState("1.21");
  const [count, setCount] = useState(1);
  const [hideFlags, setHideFlags] = useState(false);
  const [glowing, setGlowing] = useState(false);

  const addEffect = useCallback(() => {
    const newEffect: PotionEffect = {
      id: crypto.randomUUID(),
      effect: "speed",
      amplifier: 0,
      duration: 600,
      showParticles: true,
      showIcon: true,
    };
    setEffects(prev => [...prev, newEffect]);
  }, []);

  const removeEffect = useCallback((id: string) => {
    setEffects(prev => prev.filter(e => e.id !== id));
  }, []);

  const updateEffect = useCallback((id: string, field: keyof PotionEffect, value: any) => {
    setEffects(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  }, []);

  const hexToDecimal = useCallback((hex: string) => {
    return parseInt(hex.replace("#", ""), 16);
  }, []);

  const formatDuration = useCallback((ticks: number) => {
    const seconds = Math.floor(ticks / 20);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  }, []);

  const command = useMemo(() => {
    const isModern = parseFloat(version) >= 1.20;
    const is121Plus = parseFloat(version) >= 1.21;
    
    let cmd = `/give @p minecraft:${potionType}`;
    
    if (count > 1) {
      cmd += ` ${count}`;
    }

    const components: string[] = [];
    
    // Custom name
    if (potionName) {
      if (is121Plus) {
        components.push(`custom_name='"${potionName}"'`);
      } else {
        components.push(`display:{Name:'{"text":"${potionName}"}'}`);
      }
    }

    // Custom color
    const colorValue = potionColor === "custom" ? hexToDecimal(customColor).toString() : (potionColor !== "default" ? potionColor : "");
    if (colorValue) {
      if (is121Plus) {
        components.push(`potion_contents={custom_color:${colorValue}}`);
      } else {
        components.push(`CustomPotionColor:${colorValue}`);
      }
    }

    // Effects
    if (effects.length > 0) {
      if (is121Plus) {
        const effectsStr = effects.map(e => {
          const parts = [`id:"minecraft:${e.effect}"`, `amplifier:${e.amplifier}`, `duration:${e.duration}`];
          if (!e.showParticles) parts.push("show_particles:false");
          if (!e.showIcon) parts.push("show_icon:false");
          return `{${parts.join(",")}}`;
        }).join(",");
        
        if (colorValue) {
          const existing = components.findIndex(c => c.startsWith("potion_contents"));
          if (existing >= 0) {
            components[existing] = `potion_contents={custom_color:${colorValue},custom_effects:[${effectsStr}]}`;
          } else {
            components.push(`potion_contents={custom_effects:[${effectsStr}]}`);
          }
        } else {
          components.push(`potion_contents={custom_effects:[${effectsStr}]}`);
        }
      } else {
        const effectsStr = effects.map(e => {
          const parts = [`Id:${POTION_EFFECTS.findIndex(pe => pe.id === e.effect)}`, `Amplifier:${e.amplifier}b`, `Duration:${e.duration}`];
          if (!e.showParticles) parts.push("ShowParticles:0b");
          if (!e.showIcon) parts.push("ShowIcon:0b");
          return `{${parts.join(",")}}`;
        }).join(",");
        components.push(`CustomPotionEffects:[${effectsStr}]`);
      }
    }

    // Hide flags
    if (hideFlags) {
      if (is121Plus) {
        components.push("hide_additional_tooltip={}");
      } else {
        components.push("HideFlags:32");
      }
    }

    // Glowing (enchantment glint)
    if (glowing) {
      if (is121Plus) {
        components.push("enchantment_glint_override=true");
      } else {
        components.push("Enchantments:[{}]");
      }
    }

    if (components.length > 0) {
      if (is121Plus) {
        cmd += `[${components.join(",")}]`;
      } else {
        cmd += `{${components.join(",")}}`;
      }
    }

    return cmd;
  }, [potionType, potionName, potionColor, customColor, effects, version, count, hideFlags, glowing, hexToDecimal]);

  const copyCommand = useCallback(() => {
    navigator.clipboard.writeText(command);
    toast.success("Command copied to clipboard!");
  }, [command]);

  const clearAll = useCallback(() => {
    setEffects([]);
    setPotionName("");
    setPotionColor("default");
    setHideFlags(false);
    setGlowing(false);
    setCount(1);
    toast.success("All settings cleared!");
  }, []);


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Minecraft Potion Generator - Create Custom Potions | MC Server Hub</title>
        <meta name="description" content="Generate custom Minecraft potion commands with multiple effects, custom colors, and names. Supports Java Edition 1.13-1.21+." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <Beaker className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-bold">Custom Potion Generator</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create powerful custom potions with multiple effects, custom colors, and names. 
              Generate commands for Java Edition 1.13+.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Basic Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Potion Type</Label>
                      <Select value={potionType} onValueChange={setPotionType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {POTION_TYPES.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              <span className="flex items-center gap-2">
                                <span>{type.icon}</span>
                                <span>{type.name}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Minecraft Version</Label>
                      <Select value={version} onValueChange={setVersion}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.21">1.21+ (Latest)</SelectItem>
                          <SelectItem value="1.20">1.20 - 1.20.6</SelectItem>
                          <SelectItem value="1.19">1.19 - 1.19.4</SelectItem>
                          <SelectItem value="1.18">1.18 - 1.18.2</SelectItem>
                          <SelectItem value="1.17">1.17 - 1.17.1</SelectItem>
                          <SelectItem value="1.16">1.16 - 1.16.5</SelectItem>
                          <SelectItem value="1.13">1.13 - 1.15.2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Custom Name (optional)</Label>
                      <Input
                        placeholder="e.g., Potion of Awesomeness"
                        value={potionName}
                        onChange={(e) => setPotionName(e.target.value)}
                        maxLength={50}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Count</Label>
                      <Input
                        type="number"
                        min={1}
                        max={64}
                        value={count}
                        onChange={(e) => setCount(Math.min(64, Math.max(1, parseInt(e.target.value) || 1)))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Potion Color</Label>
                    <div className="flex gap-2">
                      <Select value={potionColor} onValueChange={setPotionColor}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Default (based on effects)" />
                        </SelectTrigger>
                        <SelectContent>
                          {POTION_COLORS.map(color => (
                            <SelectItem key={color.name} value={color.value}>
                              {color.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Custom Color...</SelectItem>
                        </SelectContent>
                      </Select>
                      {potionColor === "custom" && (
                        <Input
                          type="color"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          className="w-14 p-1 h-10"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="hideFlags"
                        checked={hideFlags}
                        onCheckedChange={(checked) => setHideFlags(checked as boolean)}
                      />
                      <Label htmlFor="hideFlags" className="cursor-pointer">Hide effect tooltips</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="glowing"
                        checked={glowing}
                        onCheckedChange={(checked) => setGlowing(checked as boolean)}
                      />
                      <Label htmlFor="glowing" className="cursor-pointer">Enchantment glint</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Effects */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Potion Effects
                      {effects.length > 0 && (
                        <Badge variant="secondary">{effects.length}</Badge>
                      )}
                    </CardTitle>
                    <Button onClick={addEffect} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Effect
                    </Button>
                  </div>
                  <CardDescription>
                    Add multiple effects to create powerful custom potions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {effects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Beaker className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No effects added yet</p>
                      <p className="text-sm">Click "Add Effect" to get started</p>
                    </div>
                  ) : (
                    <ScrollArea className="max-h-[400px]">
                      <div className="space-y-4">
                        {effects.map((effect, index) => (
                          <div
                            key={effect.id}
                            className="p-4 rounded-lg border bg-card/50 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <Badge 
                                variant="outline"
                                style={{ 
                                  borderColor: POTION_EFFECTS.find(e => e.id === effect.effect)?.color,
                                  color: POTION_EFFECTS.find(e => e.id === effect.effect)?.color
                                }}
                              >
                                Effect #{index + 1}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEffect(effect.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Effect Type</Label>
                                <Select
                                  value={effect.effect}
                                  onValueChange={(v) => updateEffect(effect.id, "effect", v)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {POTION_EFFECTS.map(e => (
                                      <SelectItem key={e.id} value={e.id}>
                                        <span className="flex items-center gap-2">
                                          <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: e.color }}
                                          />
                                          {e.name}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs">
                                  Level: {effect.amplifier + 1} ({["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][effect.amplifier] || effect.amplifier + 1})
                                </Label>
                                <Input
                                  type="number"
                                  min={0}
                                  max={255}
                                  value={effect.amplifier}
                                  onChange={(e) => updateEffect(effect.id, "amplifier", Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Duration: {formatDuration(effect.duration)}
                                </Label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={1000000}
                                  value={effect.duration}
                                  onChange={(e) => updateEffect(effect.id, "duration", Math.max(1, parseInt(e.target.value) || 1))}
                                  placeholder="Ticks (20 = 1 second)"
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`particles-${effect.id}`}
                                  checked={effect.showParticles}
                                  onCheckedChange={(checked) => updateEffect(effect.id, "showParticles", checked)}
                                />
                                <Label htmlFor={`particles-${effect.id}`} className="cursor-pointer text-xs">Particles</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`icon-${effect.id}`}
                                  checked={effect.showIcon}
                                  onCheckedChange={(checked) => updateEffect(effect.id, "showIcon", checked)}
                                />
                                <Label htmlFor={`icon-${effect.id}`} className="cursor-pointer text-xs">Show Icon</Label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview & Output */}
            <div className="space-y-6">
              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <img 
                        src={potionBottle} 
                        alt="Potion" 
                        className="w-20 h-20 mx-auto mb-3 object-contain"
                      />
                      <p className="font-medium">
                        {potionName || POTION_TYPES.find(t => t.id === potionType)?.name}
                      </p>
                      {effects.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {effects.slice(0, 3).map(e => {
                            const effectData = POTION_EFFECTS.find(pe => pe.id === e.effect);
                            return (
                              <p key={e.id} className="text-xs" style={{ color: effectData?.color }}>
                                {effectData?.name} {e.amplifier > 0 && ["II", "III", "IV", "V", "VI"][e.amplifier - 1] || (e.amplifier > 5 ? e.amplifier + 1 : "")} ({formatDuration(e.duration)})
                              </p>
                            );
                          })}
                          {effects.length > 3 && (
                            <p className="text-xs text-muted-foreground">+{effects.length - 3} more effects</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Command Output */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generated Command</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg font-mono text-xs break-all max-h-40 overflow-auto">
                    {command}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={copyCommand} className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Command
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-muted-foreground">
                  <p>• Duration is in game ticks (20 ticks = 1 second)</p>
                  <p>• Amplifier 0 = Level I, Amplifier 1 = Level II, etc.</p>
                  <p>• Hide tooltips to create mystery potions</p>
                  <p>• Max amplifier is 255 but most effects cap at lower levels</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PotionGenerator;