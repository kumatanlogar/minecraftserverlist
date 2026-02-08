import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Enchantment {
  id: string;
  level: number;
}

interface Attribute {
  name: string;
  operation: string;
  amount: number;
  slot: string;
}

const GiveCommandGenerator = () => {
  const { toast } = useToast();
  const [itemId, setItemId] = useState("minecraft:diamond_sword");
  const [amount, setAmount] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [lore, setLore] = useState<string[]>([""]);
  const [enchantments, setEnchantments] = useState<Enchantment[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [canPlaceOn, setCanPlaceOn] = useState("");
  const [canDestroy, setCanDestroy] = useState("");

  const enchantmentsList = [
    "protection", "fire_protection", "feather_falling", "blast_protection",
    "projectile_protection", "respiration", "aqua_affinity", "thorns",
    "depth_strider", "frost_walker", "soul_speed", "sharpness",
    "smite", "bane_of_arthropods", "knockback", "fire_aspect",
    "looting", "sweeping", "efficiency", "silk_touch",
    "unbreaking", "fortune", "power", "punch",
    "flame", "infinity", "luck_of_the_sea", "lure",
    "loyalty", "impaling", "riptide", "channeling",
    "multishot", "quick_charge", "piercing", "mending"
  ];

  const attributesList = [
    "generic.max_health", "generic.follow_range", "generic.knockback_resistance",
    "generic.movement_speed", "generic.attack_damage", "generic.attack_speed",
    "generic.armor", "generic.armor_toughness", "generic.luck"
  ];

  const generateCommand = () => {
    let command = `/give @p ${itemId} ${amount}`;
    
    const nbtParts: string[] = [];
    
    if (displayName) {
      nbtParts.push(`display:{Name:'{"text":"${displayName}","color":"gold","bold":true}'}`);
    }
    
    if (lore.some(l => l.trim())) {
      const loreArray = lore.filter(l => l.trim()).map(l => `'{"text":"${l}","color":"gray","italic":false}'`).join(",");
      if (displayName) {
        nbtParts[0] = `display:{Name:'{"text":"${displayName}","color":"gold","bold":true}',Lore:[${loreArray}]}`;
      } else {
        nbtParts.push(`display:{Lore:[${loreArray}]}`);
      }
    }
    
    if (enchantments.length > 0) {
      const enchArray = enchantments.map(e => `{id:"minecraft:${e.id}",lvl:${e.level}s}`).join(",");
      nbtParts.push(`Enchantments:[${enchArray}]`);
    }
    
    if (attributes.length > 0) {
      const attrArray = attributes.map(a => 
        `{AttributeName:"${a.name}",Name:"${a.name}",Amount:${a.amount},Operation:${a.operation},Slot:"${a.slot}"}`
      ).join(",");
      nbtParts.push(`AttributeModifiers:[${attrArray}]`);
    }
    
    if (canPlaceOn.trim()) {
      const blocks = canPlaceOn.split(",").map(b => `"${b.trim()}"`).join(",");
      nbtParts.push(`CanPlaceOn:[${blocks}]`);
    }
    
    if (canDestroy.trim()) {
      const blocks = canDestroy.split(",").map(b => `"${b.trim()}"`).join(",");
      nbtParts.push(`CanDestroy:[${blocks}]`);
    }
    
    if (nbtParts.length > 0) {
      command += ` {${nbtParts.join(",")}}`;
    }
    
    return command;
  };

  const copyCommand = () => {
    const command = generateCommand();
    navigator.clipboard.writeText(command);
    toast({
      title: "Copied!",
      description: "Command copied to clipboard",
    });
  };

  const addEnchantment = () => {
    setEnchantments([...enchantments, { id: enchantmentsList[0], level: 1 }]);
  };

  const removeEnchantment = (index: number) => {
    setEnchantments(enchantments.filter((_, i) => i !== index));
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: attributesList[0], operation: "0", amount: 1, slot: "mainhand" }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const addLoreLine = () => {
    setLore([...lore, ""]);
  };

  const removeLoreLine = (index: number) => {
    setLore(lore.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Minecraft Give Command Generator</h1>
          <p className="text-muted-foreground mb-8">
            Generate complex give commands with enchantments, attributes, and more. Paste the command into chat or a command block (requires OP).
          </p>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Settings</CardTitle>
                <CardDescription>Configure the basic item properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="itemId">Item ID</Label>
                    <Input
                      id="itemId"
                      value={itemId}
                      onChange={(e) => setItemId(e.target.value)}
                      placeholder="minecraft:diamond_sword"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      max="64"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Customize the item name and lore</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Epic Sword"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Lore Lines</Label>
                    <Button size="sm" variant="outline" onClick={addLoreLine}>
                      <Plus className="w-4 h-4 mr-1" /> Add Line
                    </Button>
                  </div>
                  {lore.map((line, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={line}
                        onChange={(e) => {
                          const newLore = [...lore];
                          newLore[index] = e.target.value;
                          setLore(newLore);
                        }}
                        placeholder={`Lore line ${index + 1}`}
                      />
                      {lore.length > 1 && (
                        <Button size="icon" variant="ghost" onClick={() => removeLoreLine(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enchantments</CardTitle>
                <CardDescription>Add enchantments to your item</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={addEnchantment} variant="outline">
                  <Plus className="w-4 h-4 mr-2" /> Add Enchantment
                </Button>
                {enchantments.map((ench, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label>Enchantment</Label>
                      <Select
                        value={ench.id}
                        onValueChange={(value) => {
                          const newEnch = [...enchantments];
                          newEnch[index].id = value;
                          setEnchantments(newEnch);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {enchantmentsList.map((e) => (
                            <SelectItem key={e} value={e}>
                              {e.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Label>Level</Label>
                      <Input
                        type="number"
                        min="1"
                        max="255"
                        value={ench.level}
                        onChange={(e) => {
                          const newEnch = [...enchantments];
                          newEnch[index].level = parseInt(e.target.value) || 1;
                          setEnchantments(newEnch);
                        }}
                      />
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeEnchantment(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attributes</CardTitle>
                <CardDescription>Add buffs or debuffs when the item is held/worn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={addAttribute} variant="outline">
                  <Plus className="w-4 h-4 mr-2" /> Add Attribute
                </Button>
                {attributes.map((attr, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div>
                      <Label>Attribute</Label>
                      <Select
                        value={attr.name}
                        onValueChange={(value) => {
                          const newAttrs = [...attributes];
                          newAttrs[index].name = value;
                          setAttributes(newAttrs);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {attributesList.map((a) => (
                            <SelectItem key={a} value={a}>
                              {a.replace("generic.", "")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Operation</Label>
                      <Select
                        value={attr.operation}
                        onValueChange={(value) => {
                          const newAttrs = [...attributes];
                          newAttrs[index].operation = value;
                          setAttributes(newAttrs);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Add</SelectItem>
                          <SelectItem value="1">Multiply Base</SelectItem>
                          <SelectItem value="2">Multiply Total</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={attr.amount}
                        onChange={(e) => {
                          const newAttrs = [...attributes];
                          newAttrs[index].amount = parseFloat(e.target.value) || 0;
                          setAttributes(newAttrs);
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label>Slot</Label>
                        <Select
                          value={attr.slot}
                          onValueChange={(value) => {
                            const newAttrs = [...attributes];
                            newAttrs[index].slot = value;
                            setAttributes(newAttrs);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mainhand">Main Hand</SelectItem>
                            <SelectItem value="offhand">Off Hand</SelectItem>
                            <SelectItem value="head">Head</SelectItem>
                            <SelectItem value="chest">Chest</SelectItem>
                            <SelectItem value="legs">Legs</SelectItem>
                            <SelectItem value="feet">Feet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => removeAttribute(index)} className="mt-6">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adventure Mode Rules</CardTitle>
                <CardDescription>Control which blocks can be placed on or destroyed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="canPlaceOn">Can Place On (comma-separated)</Label>
                  <Input
                    id="canPlaceOn"
                    value={canPlaceOn}
                    onChange={(e) => setCanPlaceOn(e.target.value)}
                    placeholder="minecraft:stone,minecraft:dirt"
                  />
                </div>
                <div>
                  <Label htmlFor="canDestroy">Can Destroy (comma-separated)</Label>
                  <Input
                    id="canDestroy"
                    value={canDestroy}
                    onChange={(e) => setCanDestroy(e.target.value)}
                    placeholder="minecraft:stone,minecraft:dirt"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Command</CardTitle>
                <CardDescription>
                  Copy this command and paste it into chat or a command block
                  {generateCommand().length > 256 && (
                    <span className="text-destructive block mt-1">
                      ⚠️ Command is {generateCommand().length} characters (chat limit: 256). Use a command block instead.
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    value={generateCommand()}
                    readOnly
                    className="font-mono text-sm min-h-[100px] pr-12"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={copyCommand}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GiveCommandGenerator;
