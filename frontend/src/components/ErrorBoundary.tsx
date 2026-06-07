import { Component } from "react";
import type {
  ErrorInfo,
  ReactNode,
} from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo
  ) {
    console.error(
      "Error Boundary Caught:",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              Something went wrong
            </h1>

            <p className="mt-3 text-slate-400">
              Please refresh the page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;