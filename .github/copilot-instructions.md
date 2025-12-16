# GitHub Copilot Instructions for OPTIK Ecosystem

## Project Overview

OPTIK Ecosystem is a comprehensive Solana-based DeFi platform featuring:
- **Frontend**: Next.js 15, React 19, TypeScript
- **Smart Contracts**: Solana programs written in Rust using Anchor framework
- **Key Features**: DEX, Token Launchpad, Memecoin Factory, Arcade Games, Vault, OPTIK GPT

## Technology Stack

### Frontend
- **Framework**: Next.js 15.0.5 with App Router
- **UI Library**: React 19.0.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, Framer Motion for animations
- **Blockchain**: @solana/web3.js, @solana/wallet-adapter-react
- **State Management**: React hooks, client-side state
- **Database**: Supabase
- **Payments**: Stripe

### Smart Contracts
- **Language**: Rust
- **Framework**: Anchor (Coral-xyz)
- **Blockchain**: Solana (Devnet/Mainnet)
- **Programs**: Vault, DEX, Token Factory, Memecoin Factory

## Project Structure

```
optik-ecosystemn/
├── .github/                    # GitHub configuration
├── optik-website/              # Main Next.js application
│   ├── src/
│   │   ├── app/               # Next.js app router pages
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility libraries
│   │   ├── middleware/        # Security and other middleware
│   │   └── types/             # TypeScript type definitions
│   ├── programs/              # Solana programs (Rust/Anchor)
│   │   ├── vault/
│   │   ├── optik-dex/
│   │   ├── memecoin-factory/
│   │   └── optik-token/
│   ├── public/                # Static assets
│   └── package.json
└── [root files]               # Legacy files in root (being migrated)
```

## Development Commands

### Frontend
```bash
cd optik-website
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run deploy   # Deploy to Vercel
```

### Smart Contracts
```bash
cd optik-website
anchor build     # Build Solana programs
anchor test      # Run tests
anchor deploy    # Deploy programs
```

## Coding Standards & Best Practices

### TypeScript/React
1. **Type Safety**: Always use TypeScript types, avoid `any` when possible
2. **Components**: Use functional components with hooks
3. **File Naming**: 
   - Components: PascalCase (e.g., `WalletProvider.tsx`)
   - Utilities: kebab-case (e.g., `revenue-optimizer.tsx`)
4. **Imports**: Group imports (React, third-party, local)
5. **Error Handling**: Always handle errors, especially for blockchain interactions

### React Patterns
1. **State Management**: Use `useState` and `useEffect` appropriately
2. **Hydration**: Be careful with server/client mismatches (use `useEffect` for client-only code)
3. **Performance**: Avoid setting state during render - use `setTimeout` or `useEffect`
4. **Async Operations**: Handle loading states and errors for all async operations

### Solana/Web3 Development
1. **Wallet Connection**: Always check wallet connection before transactions
2. **Error Messages**: Provide user-friendly error messages for blockchain errors
3. **Transaction Handling**: Show loading states and confirmation messages
4. **Security**: Validate all inputs, especially when dealing with tokens/money

### Styling
1. **Tailwind CSS**: Use Tailwind utility classes
2. **Animations**: Use Framer Motion for complex animations
3. **Responsive**: Mobile-first approach, test all breakpoints
4. **Components**: Use the UI component library in `src/components/ui/`

### Security Considerations
1. **Input Validation**: Always validate and sanitize user inputs
2. **XSS Prevention**: Use proper escaping for user-generated content
3. **API Keys**: Never commit API keys or secrets
4. **Wallet Security**: Never request private keys, only public keys
5. **Smart Contract Audits**: Test thoroughly before deploying to mainnet

## Common Patterns

### Component Structure
```typescript
'use client' // If client-side only

import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

interface ComponentProps {
  // Type definitions
}

export default function Component({ prop }: ComponentProps) {
  const [state, setState] = useState<Type>(initialValue)
  const { connected, publicKey } = useWallet()

  useEffect(() => {
    // Side effects
  }, [dependencies])

  return (
    // JSX
  )
}
```

### Error Handling
```typescript
try {
  // Blockchain operation
  const result = await connection.someOperation()
  toast.success('Operation successful!')
} catch (error) {
  console.error('Operation failed:', error)
  toast.error('Failed to complete operation. Please try again.')
}
```

## Issue Assignment Guidelines

### Best Tasks for Copilot
- ✅ Bug fixes in existing code
- ✅ Adding new UI components
- ✅ Implementing new features with clear requirements
- ✅ Writing tests
- ✅ Updating documentation
- ✅ Code refactoring
- ✅ Adding error handling

### Tasks Requiring Human Review
- ⚠️ Smart contract changes (security critical)
- ⚠️ Payment/Stripe integration changes
- ⚠️ Database schema changes
- ⚠️ Major architectural changes
- ⚠️ Changes affecting user funds or tokens

## Testing Guidelines

1. **Manual Testing**: Always test changes in development environment
2. **Blockchain Testing**: Use Devnet before Mainnet
3. **Wallet Testing**: Test with multiple wallet adapters
4. **Error Scenarios**: Test error cases and edge cases
5. **Browser Testing**: Test in Chrome, Firefox, Safari

## Known Issues & Context

1. **Hydration**: Be careful with `Date.now()` - use client-side only in `useEffect`
2. **State Updates**: Don't call setState during render, use `setTimeout` or `useEffect`
3. **Database**: Some features require Supabase RPC functions (see `SETUP_DATABASE.md`)
4. **Deployment**: Platform is on Devnet, mainnet launch planned after revenue targets

## File Organization

- Place new components in `src/components/`
- Place new pages in `src/app/[route]/`
- Place utilities in `src/lib/`
- Place types in `src/types/`
- Place hooks in `src/hooks/`

## Environment Variables

Required in `.env.local`:
- Supabase keys
- Solana RPC URL
- Stripe keys (production)
- OpenAI API key (for OPTIK GPT)

## Additional Resources

- Solana Documentation: https://docs.solana.com/
- Anchor Framework: https://www.anchor-lang.com/
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

## Acceptance Criteria for PRs

1. ✅ Code follows TypeScript and React best practices
2. ✅ No TypeScript errors or warnings
3. ✅ Linting passes (`npm run lint`)
4. ✅ Manual testing completed in development
5. ✅ No console errors in browser
6. ✅ Responsive design works on mobile and desktop
7. ✅ Error handling is comprehensive
8. ✅ Changes are documented if needed
9. ✅ Security considerations are addressed
10. ✅ No secrets or API keys committed

## Communication Style

When working on issues:
1. Start by understanding the requirements fully
2. Ask clarifying questions if needed
3. Provide clear explanations of changes made
4. Document any trade-offs or decisions
5. Highlight any security or performance considerations
6. Suggest improvements when appropriate

---

**Remember**: This is a financial platform dealing with real user funds. Security, accuracy, and user experience are paramount. When in doubt, ask for clarification or human review.
