import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#F0F4F8]">
          <div className="bg-white max-w-lg w-full rounded-2xl p-8 text-center shadow-lg border border-[#E2E8F0] animate-fade-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">⚠️</div>
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Something went wrong</h2>
            <p className="text-[#4A5568] mb-6 whitespace-pre-wraptext-sm">
              We've encountered an unexpected error. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#1B3A5C] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#1B4332] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
