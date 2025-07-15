"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Code, Heart, ChevronDown, ChevronUp, Maximize2, Minimize2 } from "lucide-react";
import dynamicImport from 'next/dynamic';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

const SwaggerUI = dynamicImport(() => import('swagger-ui-react'), { ssr: false });

// Import CSS after component loads
if (typeof window !== 'undefined') {
  import('swagger-ui-react/swagger-ui.css');
}

export default function ApiDocsPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [apiSpec, setApiSpec] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const loadApiSpec = async () => {
      try {
        const response = await fetch('/api/docs');
        const spec = await response.json();
        
        if (mounted) {
          setApiSpec(spec);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to load API specification:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadApiSpec();

    // Add custom CSS for SwaggerUI
    const style = document.createElement('style');
    style.textContent = `
      .swagger-ui {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      }
      .swagger-ui .wrapper {
        padding: 20px;
      }
      .swagger-ui .info {
        margin-bottom: 20px;
      }
      .swagger-ui .info .title {
        font-size: 24px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 10px;
      }
      .swagger-ui .opblock {
        margin-bottom: 10px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      .swagger-ui .opblock-summary {
        padding: 16px;
        background: #fafafa;
        border-radius: 8px 8px 0 0;
      }
      .swagger-ui .btn {
        border-radius: 6px;
        padding: 8px 16px;
        font-weight: 500;
        font-size: 14px;
      }
      .swagger-ui .btn.execute {
        background: #10b981;
        border-color: #10b981;
        color: white;
      }
      .swagger-ui .btn.execute:hover {
        background: #059669;
        border-color: #059669;
      }
      .swagger-ui .opblock-tag {
        font-size: 18px;
        font-weight: 600;
        margin: 20px 0 15px 0;
        color: #1f2937;
      }
    `;
    document.head.appendChild(style);

    return () => {
      mounted = false;
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const toggleHeader = useCallback(() => {
    setShowHeader(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <div className="border-b border-emerald-900/20 bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  MediMeet API Documentation
                </h1>
                <p className="text-muted-foreground text-sm lg:text-base">
                  Comprehensive API documentation for the MediMeet telemedicine platform
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 hover:bg-emerald-700">
                  v1.0.0
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleHeader}
                  className="text-muted-foreground hover:text-white"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showHeader && (
        <div className="border-b border-emerald-900/20 bg-muted/30">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-white">MediMeet API</h1>
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                  v1.0.0
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpanded}
                  className="text-muted-foreground hover:text-white"
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleHeader}
                  className="text-muted-foreground hover:text-white"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHeader && (
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-emerald-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-white text-base">
                  <FileText className="h-4 w-4 mr-2 text-emerald-400" />
                  API Overview
                </CardTitle>
                <CardDescription className="text-sm">
                  Business logic, architecture, and getting started guide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/API_DOCUMENTATION.md" target="_blank">
                    View Documentation
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-emerald-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-white text-base">
                  <Code className="h-4 w-4 mr-2 text-emerald-400" />
                  OpenAPI Spec
                </CardTitle>
                <CardDescription className="text-sm">
                  Raw OpenAPI 3.0 specification in JSON format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" size="sm" className="w-full border-emerald-900/30">
                  <Link href="/api/docs" target="_blank">
                    View JSON Spec
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-emerald-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-white text-base">
                  <Heart className="h-4 w-4 mr-2 text-emerald-400" />
                  Health Check
                </CardTitle>
                <CardDescription className="text-sm">
                  Check system health and service status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" size="sm" className="w-full border-emerald-900/30">
                  <Link href="/api/health" target="_blank">
                    Check Health
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-3">Key Features</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-emerald-900/20 bg-card">
                <h3 className="font-semibold text-white mb-1 text-sm">Authentication</h3>
                <p className="text-xs text-muted-foreground">
                  Clerk-based JWT authentication
                </p>
              </div>
              <div className="p-3 rounded-lg border border-emerald-900/20 bg-card">
                <h3 className="font-semibold text-white mb-1 text-sm">Video Calls</h3>
                <p className="text-xs text-muted-foreground">
                  Vonage-powered consultations
                </p>
              </div>
              <div className="p-3 rounded-lg border border-emerald-900/20 bg-card">
                <h3 className="font-semibold text-white mb-1 text-sm">Credit System</h3>
                <p className="text-xs text-muted-foreground">
                  Flexible appointment booking
                </p>
              </div>
              <div className="p-3 rounded-lg border border-emerald-900/20 bg-card">
                <h3 className="font-semibold text-white mb-1 text-sm">Admin Panel</h3>
                <p className="text-xs text-muted-foreground">
                  Doctor verification system
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-muted/30 border-y border-emerald-900/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Interactive API Explorer</h2>
            <div className="flex items-center gap-2">
              {!showHeader && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpanded}
                  className="text-muted-foreground hover:text-white"
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  <span className="ml-2 text-xs">
                    {isExpanded ? "Minimize" : "Maximize"}
                  </span>
                </Button>
              )}
              {showHeader && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleHeader}
                  className="text-muted-foreground hover:text-white"
                >
                  <ChevronUp className="h-4 w-4" />
                  <span className="ml-2 text-xs">Hide Header</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className={`${isExpanded ? '' : 'container mx-auto px-4 py-4'}`}>
          <div 
            className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200" 
            style={{ 
              height: isExpanded ? "calc(100vh - 140px)" : "calc(100vh - 300px)",
              minHeight: "500px"
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading API Documentation...</p>
                </div>
              </div>
            ) : apiSpec ? (
              <div className="h-full overflow-auto">
                <SwaggerUI 
                  spec={apiSpec}
                  docExpansion="none"
                  defaultModelsExpandDepth={1}
                  defaultModelExpandDepth={1}
                  displayRequestDuration={true}
                  filter={true}
                  showExtensions={true}
                  showCommonExtensions={true}
                  tryItOutEnabled={true}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-red-500 mb-2">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Failed to load API documentation</p>
                  <p className="text-sm text-gray-500 mt-2">Please try refreshing the page</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
