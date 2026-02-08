import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ColorCodeGenerator = () => {
  const [text, setText] = useState("");
  const { toast } = useToast();

  const colors = [
    { name: "Black", code: "&0", color: "#000000" },
    { name: "Dark Blue", code: "&1", color: "#0000AA" },
    { name: "Dark Green", code: "&2", color: "#00AA00" },
    { name: "Dark Aqua", code: "&3", color: "#00AAAA" },
    { name: "Dark Red", code: "&4", color: "#AA0000" },
    { name: "Dark Purple", code: "&5", color: "#AA00AA" },
    { name: "Gold", code: "&6", color: "#FFAA00" },
    { name: "Gray", code: "&7", color: "#AAAAAA" },
    { name: "Dark Gray", code: "&8", color: "#555555" },
    { name: "Blue", code: "&9", color: "#5555FF" },
    { name: "Green", code: "&a", color: "#55FF55" },
    { name: "Aqua", code: "&b", color: "#55FFFF" },
    { name: "Red", code: "&c", color: "#FF5555" },
    { name: "Light Purple", code: "&d", color: "#FF55FF" },
    { name: "Yellow", code: "&e", color: "#FFFF55" },
    { name: "White", code: "&f", color: "#FFFFFF" },
  ];

  const formats = [
    { name: "Bold", code: "&l" },
    { name: "Italic", code: "&o" },
    { name: "Underline", code: "&n" },
    { name: "Strikethrough", code: "&m" },
    { name: "Reset", code: "&r" },
  ];

  const addCode = (code: string) => {
    setText(text + code);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Color codes copied to clipboard",
    });
  };

  const parseMinecraftText = (text: string) => {
    const parts: { text: string; color?: string; bold?: boolean; italic?: boolean; underline?: boolean; strikethrough?: boolean }[] = [];
    let currentColor = "#FFFFFF";
    let currentBold = false;
    let currentItalic = false;
    let currentUnderline = false;
    let currentStrikethrough = false;
    let currentText = "";

    for (let i = 0; i < text.length; i++) {
      if (text[i] === "&" && i + 1 < text.length) {
        if (currentText) {
          parts.push({
            text: currentText,
            color: currentColor,
            bold: currentBold,
            italic: currentItalic,
            underline: currentUnderline,
            strikethrough: currentStrikethrough,
          });
          currentText = "";
        }

        const code = text[i + 1].toLowerCase();
        const colorMatch = colors.find(c => c.code === `&${code}`);
        if (colorMatch) {
          currentColor = colorMatch.color;
        } else if (code === "l") currentBold = true;
        else if (code === "o") currentItalic = true;
        else if (code === "n") currentUnderline = true;
        else if (code === "m") currentStrikethrough = true;
        else if (code === "r") {
          currentColor = "#FFFFFF";
          currentBold = false;
          currentItalic = false;
          currentUnderline = false;
          currentStrikethrough = false;
        }
        i++;
      } else {
        currentText += text[i];
      }
    }

    if (currentText) {
      parts.push({
        text: currentText,
        color: currentColor,
        bold: currentBold,
        italic: currentItalic,
        underline: currentUnderline,
        strikethrough: currentStrikethrough,
      });
    }

    return parts;
  };

  const preview = parseMinecraftText(text);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Minecraft Color Code Generator</h1>
          <p className="text-muted-foreground mb-8">
            Create colorful text with formatting codes for signs, books, chat, and MOTD messages.
          </p>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Color Codes</CardTitle>
                  <CardDescription>Click to add color codes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <Button
                        key={color.code}
                        onClick={() => addCode(color.code)}
                        variant="outline"
                        className="flex items-center gap-2 justify-start"
                        title={color.name}
                      >
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: color.color }}
                        />
                        <span className="text-xs">{color.code}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Formatting Codes</CardTitle>
                  <CardDescription>Click to add formatting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {formats.map((format) => (
                      <Button
                        key={format.code}
                        onClick={() => addCode(format.code)}
                        variant="outline"
                      >
                        {format.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Text</CardTitle>
                  <CardDescription>Type or use codes above</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your text with color codes..."
                    className="font-mono"
                  />
                  <Button onClick={handleCopy} className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How it will look in Minecraft</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-black p-4 rounded min-h-[100px] font-mono text-lg">
                    {preview.map((part, index) => (
                      <span
                        key={index}
                        style={{
                          color: part.color,
                          fontWeight: part.bold ? "bold" : "normal",
                          fontStyle: part.italic ? "italic" : "normal",
                          textDecoration: part.underline
                            ? "underline"
                            : part.strikethrough
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {part.text}
                      </span>
                    ))}
                  </div>
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

export default ColorCodeGenerator;
