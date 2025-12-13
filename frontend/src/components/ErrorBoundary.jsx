import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, info: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // You can log the error to an external service here
        console.error('Uncaught error:', error, info);
        this.setState({ info });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
                    <div className="max-w-xl text-center">
                        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                        <p className="mb-4">An unexpected error occurred. Try refreshing the page or come back later.</p>
                        <details className="text-xs text-left text-white/60 p-3 bg-white/5 rounded-md">
                            <summary className="cursor-pointer">Error details</summary>
                            <pre className="whitespace-pre-wrap mt-2">{String(this.state.error)}{this.state.info ? '\n' + this.state.info.componentStack : ''}</pre>
                        </details>
                        <div className="mt-6 flex justify-center gap-3">
                            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded bg-green-600">Reload</button>
                            <button onClick={() => this.setState({ hasError: false, error: null, info: null })} className="px-4 py-2 rounded bg-white text-black">Dismiss</button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
