'use client';

if (typeof window !== 'undefined') {
    // Intercept ALL console.error calls
    const originalError = console.error;

    console.error = (...args: any[]) => {
        const errorString = args.join(' ');

        // Block ANY wallet-related errors completely
        if (
            errorString.includes('WalletConnectionError') ||
            errorString.includes('WalletNotReadyError') ||
            errorString.includes('Unexpected error {}') ||
            errorString.includes('wallet-adapter') ||
            errorString.includes('@solana/wallet')
        ) {
            // COMPLETELY IGNORE - Don't log anything
            return;
        }

        // Call original for everything else
        originalError.apply(console, args);
    };

    // Also suppress unhandled promise rejections from wallets
    window.addEventListener('unhandledrejection', (event) => {
        const error = event.reason?.message || event.reason?.toString() || '';

        if (
            error.includes('WalletConnectionError') ||
            error.includes('wallet-adapter') ||
            error.includes('Unexpected error')
        ) {
            event.preventDefault(); // Stop it from propagating
        }
    });
}

export { };
