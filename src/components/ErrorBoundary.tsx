import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 my-6 bg-slate-900 border border-slate-800 rounded-lg max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-rose-950/60 border border-rose-800/60 rounded text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="text-base font-semibold text-white">
                {this.props.fallbackTitle || 'Module Rendering Exception'}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected rendering condition occurred in this analytical module. Your session data and pipeline records remain intact.
              </p>
              {this.state.error && (
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded text-[11px] font-mono text-rose-300 overflow-x-auto">
                  {this.state.error.message}
                </pre>
              )}
              <div className="pt-2">
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs rounded transition-colors inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reload Analytical Module</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
