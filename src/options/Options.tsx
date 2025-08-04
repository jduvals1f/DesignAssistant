import { useState, useEffect } from 'react';
import { brandTokenStore } from '@/lib/brandTokenStore';
import { BrandToken } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Palette, Type, Ruler } from 'lucide-react';

export default function Options() {
  const [brandTokens, setBrandTokens] = useState<BrandToken>({
    id: 'default',
    primaryHex: '#3b82f6',
    secondaryHex: '#64748b',
    accentHex: ['#f59e0b', '#10b981', '#ef4444'],
    fontFamily: 'Inter',
    spacingScale: [2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadBrandTokens();
  }, []);

  const loadBrandTokens = async () => {
    try {
      const tokens = await brandTokenStore.getDefaultBrandToken();
      setBrandTokens(tokens);
    } catch (error) {
      console.error('Failed to load brand tokens:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await brandTokenStore.saveBrandToken(brandTokens);
      setMessage({ type: 'success', text: 'Brand tokens saved successfully!' });
    } catch (error) {
      console.error('Failed to save brand tokens:', error);
      setMessage({ type: 'error', text: 'Failed to save brand tokens. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccentColorChange = (index: number, value: string) => {
    const newAccentHex = [...brandTokens.accentHex];
    newAccentHex[index] = value;
    setBrandTokens({ ...brandTokens, accentHex: newAccentHex });
  };

  const addAccentColor = () => {
    setBrandTokens({
      ...brandTokens,
      accentHex: [...brandTokens.accentHex, '#000000']
    });
  };

  const removeAccentColor = (index: number) => {
    const newAccentHex = brandTokens.accentHex.filter((_, i) => i !== index);
    setBrandTokens({ ...brandTokens, accentHex: newAccentHex });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">UX Refactor Assistant</h1>
          <p className="text-muted-foreground mt-2">Configure your brand tokens and settings</p>
        </div>

        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Brand Colors
            </CardTitle>
            <CardDescription>
              Define your primary, secondary, and accent colors for consistent UI improvements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary"
                    type="color"
                    value={brandTokens.primaryHex}
                    onChange={(e) => setBrandTokens({ ...brandTokens, primaryHex: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={brandTokens.primaryHex}
                    onChange={(e) => setBrandTokens({ ...brandTokens, primaryHex: e.target.value })}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary"
                    type="color"
                    value={brandTokens.secondaryHex}
                    onChange={(e) => setBrandTokens({ ...brandTokens, secondaryHex: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={brandTokens.secondaryHex}
                    onChange={(e) => setBrandTokens({ ...brandTokens, secondaryHex: e.target.value })}
                    placeholder="#64748b"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Accent Colors</Label>
                <Button variant="outline" size="sm" onClick={addAccentColor}>
                  Add Color
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brandTokens.accentHex.map((color, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={color}
                      onChange={(e) => handleAccentColorChange(index, e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={color}
                      onChange={(e) => handleAccentColorChange(index, e.target.value)}
                      placeholder="#f59e0b"
                    />
                    {brandTokens.accentHex.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAccentColor(index)}
                        className="text-destructive"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Typography
            </CardTitle>
            <CardDescription>
              Set your preferred font family for consistent typography
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Input
                id="fontFamily"
                value={brandTokens.fontFamily}
                onChange={(e) => setBrandTokens({ ...brandTokens, fontFamily: e.target.value })}
                placeholder="Inter"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Spacing Scale
            </CardTitle>
            <CardDescription>
              Define your spacing scale for consistent layout improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Spacing Values (px)</Label>
              <div className="flex flex-wrap gap-2">
                {brandTokens.spacingScale.map((spacing, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={spacing}
                      onChange={(e) => {
                        const newScale = [...brandTokens.spacingScale];
                        newScale[index] = parseInt(e.target.value) || 0;
                        setBrandTokens({ ...brandTokens, spacingScale: newScale });
                      }}
                      className="w-16"
                      min="0"
                    />
                    {index < brandTokens.spacingScale.length - 1 && <span>px,</span>}
                    {index === brandTokens.spacingScale.length - 1 && <span>px</span>}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
} 