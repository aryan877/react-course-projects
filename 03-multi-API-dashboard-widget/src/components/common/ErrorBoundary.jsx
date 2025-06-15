import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Widget Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-950/20 border-2 border-dashed border-red-300 dark:border-red-800 rounded-xl min-h-[200px]">
          <div className="text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
              Widget Error
            </h3>
            <p className="text-red-500 dark:text-red-300">
              Something went wrong with this widget.
            </p>
            <button
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
