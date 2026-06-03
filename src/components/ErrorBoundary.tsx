import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          fontFamily: 'sans-serif',
          background: '#fdf0ee',
          border: '1px solid #f9c7c2',
          borderRadius: '16px',
          color: '#d6453d',
          maxWidth: '600px',
          margin: '40px auto',
          textAlign: 'left'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold' }}>
            Aplikasi Mengalami Error Runtime ❌
          </h2>
          <p style={{ fontSize: '13px', margin: '0 0 20px 0', color: '#546253' }}>
            React menangkap kesalahan fatal saat merender tampilan. Silakan kirimkan detail ini ke agen AI Anda:
          </p>
          <div style={{
            background: '#171d16',
            color: '#ffd9de',
            fontFamily: 'monospace',
            fontSize: '11px',
            padding: '16px',
            borderRadius: '12px',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            <strong>{this.state.error && this.state.error.toString()}</strong>
            <br /><br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              background: '#d6453d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '99px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
