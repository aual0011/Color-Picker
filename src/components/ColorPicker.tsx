import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const ColorPicker = () => {
  const [rgb, setRgb] = useState({ r: 155, g: 135, b: 245 }); // Default to our primary purple
  const [hsl, setHsl] = useState({ h: 0, s: 0, l: 0 });
  const [hex, setHex] = useState('#9b87f5');
  const { toast } = useToast();

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Update HSL and HEX when RGB changes
  useEffect(() => {
    const newHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setHsl(newHsl);
    setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
  }, [rgb]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${text} has been copied to your clipboard.`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Color Palette Tool</h1>
          <p className="text-gray-600">Adjust the sliders to create your perfect color</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Color Preview */}
          <div className="w-full md:w-1/3">
            <div 
              className="w-full aspect-square rounded-lg shadow-inner"
              style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
            />
          </div>

          {/* Controls */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* RGB Controls */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">RGB</h2>
              <div className="space-y-3">
                {['r', 'g', 'b'].map((channel) => (
                  <div key={channel} className="flex items-center gap-4">
                    <span className="w-8 uppercase font-medium">{channel}</span>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={rgb[channel as keyof typeof rgb]}
                      onChange={(e) => setRgb({ ...rgb, [channel]: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer color-slider"
                      style={{
                        background: channel === 'r' ? `linear-gradient(to right, rgb(0,${rgb.g},${rgb.b}), rgb(255,${rgb.g},${rgb.b}))` :
                                 channel === 'g' ? `linear-gradient(to right, rgb(${rgb.r},0,${rgb.b}), rgb(${rgb.r},255,${rgb.b}))` :
                                                 `linear-gradient(to right, rgb(${rgb.r},${rgb.g},0), rgb(${rgb.r},${rgb.g},255))`
                      }}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="255"
                      value={rgb[channel as keyof typeof rgb]}
                      onChange={(e) => setRgb({ ...rgb, [channel]: Math.min(255, Math.max(0, parseInt(e.target.value) || 0)) })}
                      className="w-16 text-center"
                    />
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy RGB
              </Button>
            </div>

            {/* HSL Display */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">HSL</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Hue</div>
                  <div className="font-medium">{hsl.h}°</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Saturation</div>
                  <div className="font-medium">{hsl.s}%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Lightness</div>
                  <div className="font-medium">{hsl.l}%</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy HSL
              </Button>
            </div>

            {/* HEX Display */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">HEX</h2>
              <Input
                value={hex}
                readOnly
                className="text-center uppercase"
              />
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleCopy(hex)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy HEX
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;