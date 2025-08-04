import { useState, useEffect } from 'react';
import { captureService } from '@/lib/captureService';
import { heuristicsEngine } from '@/lib/heuristicsEngine';
import { codeGenerator } from '@/lib/codeGenerator';
import { brandTokenStore } from '@/lib/brandTokenStore';
import { BrandToken, ScreenAnalysis } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Camera, Code, CheckCircle, AlertTriangle, Copy } from 'lucide-react';

export default function Popup() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ScreenAnalysis | null>(null);
  const [brandTokens, setBrandTokens] = useState<BrandToken | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleCapture = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentAnalysis(null);

    try {
      // Capture current tab
      const captureResult = await captureService.captureCurrentTab();
      
      // Analyze the page
      const findings = await heuristicsEngine.analyzePage(brandTokens!);
      
      // Generate improved code
      const improvedJsx = await codeGenerator.generateImprovedCode(
        captureResult.jsxSource,
        findings,
        brandTokens!
      );

      // Generate diff
      const diffResult = await codeGenerator.generateDiff(
        captureResult.jsxSource,
        improvedJsx
      );

      // Create analysis object
      const analysis: ScreenAnalysis = {
        id: `analysis-${Date.now()}`,
        timestamp: captureResult.timestamp,
        imgBlob: captureResult.screenshot,
        jsxSource: captureResult.jsxSource,
        findings,
        generatedJsx: improvedJsx,
        patch: diffResult.unifiedDiff
      };

      setCurrentAnalysis(analysis);
      
      // Save to storage
      await brandTokenStore.saveScreenAnalysis(analysis);

    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Failed to analyze the current page. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getSeverityIcon = (severity: 'error' | 'warn') => {
    return severity === 'error' ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />;
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      contrast: 'bg-red-100 text-red-800',
      spacing: 'bg-blue-100 text-blue-800',
      'component-misuse': 'bg-purple-100 text-purple-800',
      'design-best-practice': 'bg-green-100 text-green-800'
    };
    return <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{type}</Badge>;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">UX Refactor Assistant</h1>
        <Button
          onClick={handleCapture}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          {isLoading ? 'Analyzing...' : 'Capture & Analyze'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentAnalysis && (
        <Tabs defaultValue="findings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="findings">Findings ({currentAnalysis.findings.length})</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="diff">Diff</TabsTrigger>
          </TabsList>

          <TabsContent value="findings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Analysis Complete
                </CardTitle>
                <CardDescription>
                  Found {currentAnalysis.findings.length} issues to improve
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentAnalysis.findings.length === 0 ? (
                  <p className="text-muted-foreground">No issues found! Your UI looks great.</p>
                ) : (
                  currentAnalysis.findings.map((finding) => (
                    <div key={finding.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(finding.severity)}
                          {getTypeBadge(finding.type)}
                        </div>
                        <Badge variant={finding.severity === 'error' ? 'destructive' : 'secondary'}>
                          {finding.severity}
                        </Badge>
                      </div>
                      <p className="text-sm">{finding.suggestion}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Improved Code
                </CardTitle>
                <CardDescription>
                  Generated React + Tailwind code with Radix components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(currentAnalysis.generatedJsx)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-64">
                    <code>{currentAnalysis.generatedJsx}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diff" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Unified Diff</CardTitle>
                <CardDescription>
                  Changes needed to improve your UI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(currentAnalysis.patch)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-64">
                    <code>{currentAnalysis.patch}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!currentAnalysis && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Camera className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Ready to analyze</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Capture & Analyze" to scan the current page for UI/UX improvements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 