/**
 * Admin Error Boundary
 * Catches errors in Admin Dashboard and displays fallback UI
 * Best practice: Isolate errors to prevent full app crash
 */

import React, { ReactNode, Component, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('[AdminErrorBoundary] Error caught:', error, errorInfo);

    // Update state with error details
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (e.g., Sentry)
      console.error('[AdminErrorBoundary] Sending error to tracking service...');
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleNavigateHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-md w-full border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <div>
                  <CardTitle className="text-red-900">Fehler im Admin-Dashboard</CardTitle>
                  <CardDescription className="text-red-700">
                    Ein unerwarteter Fehler ist aufgetreten
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error message */}
              <div className="bg-white rounded p-3 border border-red-200">
                <p className="text-sm font-mono text-red-900 break-words">
                  {this.state.error?.message || 'Unbekannter Fehler'}
                </p>
              </div>

              {/* Development error details */}
              {isDevelopment && this.state.errorInfo && (
                <details className="text-xs">
                  <summary className="cursor-pointer font-semibold text-red-900 hover:text-red-700">
                    Fehlerdetails (Entwicklung)
                  </summary>
                  <pre className="mt-2 bg-white rounded p-2 overflow-auto max-h-40 text-red-900 border border-red-200">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Error count warning */}
              {this.state.errorCount > 2 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                  <p className="text-xs text-yellow-900">
                    ⚠️ Mehrere Fehler erkannt ({this.state.errorCount}).
                    Bitte laden Sie die Seite neu.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={this.state.errorCount > 2}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Erneut versuchen
                </Button>

                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Seite neu laden
                </Button>

                <Button
                  onClick={this.handleNavigateHome}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Startseite
                </Button>
              </div>

              {/* Support message */}
              <p className="text-xs text-red-700 text-center">
                Falls der Fehler weiterhin besteht, kontaktieren Sie bitte den Support.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;
