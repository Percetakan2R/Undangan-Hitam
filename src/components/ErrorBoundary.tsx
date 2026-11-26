import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Terjadi kesalahan saat memuat halaman.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught app error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 bg-[#100E0A] text-[#E9E1DA] text-center">
          <div className="max-w-md rounded-2xl border border-[#C9A96E]/50 bg-[#1E1B17] p-6 shadow-xl flex flex-col items-center gap-3">
            <h1 className="font-display text-2xl text-[#E6C487]">
              Undangan Rafi &amp; Alesha
            </h1>
            <p className="font-body text-xs text-[#D0C5B5] leading-relaxed">
              Maaf, terjadi kendala saat menampilkan halaman ({this.state.message}).
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-1 inline-flex items-center justify-center rounded-full border border-[#C9A96E] bg-[#100E0A] px-5 py-2 text-xs font-semibold text-[#E9E1DA] hover:bg-[#221F1B]"
            >
              Muat Ulang
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
