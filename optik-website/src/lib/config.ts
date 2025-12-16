export const siteConfig = {
  name: "OptiK",
  title: "OptiK - Token Creation Platform",
  description: "Create, deploy, and manage tokens on Solana with AI-powered assistance",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://optik.vercel.app",
  ogImage: "/images/og.png",
  creator: "@optik",
  keywords: [
    "token creation",
    "solana",
    "blockchain",
    "cryptocurrency",
    "defi",
    "web3",
    "ai assistant",
    "smart contracts"
  ],
  authors: [
    {
      name: "OptiK Team",
      url: "https://optik.vercel.app",
    }
  ],
  links: {
    twitter: "https://twitter.com/optik",
    github: "https://github.com/optik",
    discord: "https://discord.gg/optik",
    docs: "https://docs.optik.dev",
  },
  navItems: [
    {
      title: "Dashboard",
      href: "/dashboard",
      description: "Manage your tokens and portfolio"
    },
    {
      title: "Launchpad",
      href: "/launchpad",
      description: "Create and deploy new tokens"
    },
    {
      title: "AI Assistant",
      href: "/dashboard?chat=true",
      description: "Get help from OptiK AI"
    }
  ],
  footerItems: [
    {
      title: "Product",
      items: [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Launchpad", href: "/launchpad" },
        { name: "API", href: "/api" },
        { name: "Pricing", href: "/pricing" }
      ]
    },
    {
      title: "Resources",
      items: [
        { name: "Documentation", href: "/docs" },
        { name: "Tutorials", href: "/tutorials" },
        { name: "Blog", href: "/blog" },
        { name: "Support", href: "/support" }
      ]
    },
    {
      title: "Community",
      items: [
        { name: "Discord", href: "https://discord.gg/optik" },
        { name: "Twitter", href: "https://twitter.com/optik" },
        { name: "GitHub", href: "https://github.com/optik" },
        { name: "Reddit", href: "https://reddit.com/r/optik" }
      ]
    },
    {
      title: "Legal",
      items: [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Cookies", href: "/cookies" },
        { name: "Security", href: "/security" }
      ]
    }
  ]
};

export const tokenCreationConfig = {
  defaultValues: {
    name: "",
    symbol: "",
    description: "",
    totalSupply: 1000000,
    decimals: 9,
    mintAuthority: true,
    freezeAuthority: false,
    imageUrl: "",
    websiteUrl: "",
    telegramUrl: "",
    twitterUrl: "",
  },
  validation: {
    name: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9\s\-_]+$/
    },
    symbol: {
      minLength: 2,
      maxLength: 10,
      pattern: /^[A-Z0-9]+$/
    },
    description: {
      maxLength: 500
    },
    totalSupply: {
      min: 1,
      max: 1000000000000
    },
    decimals: {
      min: 0,
      max: 18
    }
  },
  pricing: {
    basic: {
      name: "Basic",
      price: 50,
      currency: "USD",
      features: [
        "Token creation",
        "Basic metadata",
        "Standard deployment",
        "Community support"
      ]
    },
    pro: {
      name: "Pro",
      price: 100,
      currency: "USD",
      features: [
        "Everything in Basic",
        "Custom metadata",
        "Priority deployment",
        "Advanced features",
        "Email support"
      ]
    },
    enterprise: {
      name: "Enterprise",
      price: 250,
      currency: "USD",
      features: [
        "Everything in Pro",
        "White-label solution",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee"
      ]
    }
  }
};

export const solanaConfig = {
  network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet",
  rpcEndpoint: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
  commitment: "confirmed" as const,
  wsEndpoint: process.env.NEXT_PUBLIC_SOLANA_WS_URL || "wss://api.devnet.solana.com",
  explorerUrl: process.env.NEXT_PUBLIC_SOLANA_EXPLORER || "https://explorer.solana.com",
  maxRetries: 3,
  retryDelay: 1000,
  confirmationTimeoutMs: 30000,
  skipPreflight: false,
  preflightCommitment: "confirmed" as const,
};

export const aiConfig = {
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 1000,
  contextWindowSize: 8000,
  rateLimit: {
    requestsPerMinute: 20,
    tokensPerMinute: 40000
  },
  features: {
    chatAssistant: true,
    tokenAdvice: true,
    marketAnalysis: true,
    codeGeneration: false,
    imageGeneration: false
  }
};

export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  currency: "usd",
  locale: "en",
  appearance: {
    theme: "night" as const,
    variables: {
      colorPrimary: "#7c3aed",
      colorBackground: "#0f0f23",
      colorText: "#f8fafc",
      colorDanger: "#ef4444",
      fontFamily: "Inter, system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px"
    }
  }
};

export const databaseConfig = {
  tables: {
    tokens: "tokens",
    users: "users", 
    payments: "payments",
    deployments: "deployments",
    chat_sessions: "chat_sessions",
    chat_messages: "chat_messages"
  },
  realtime: {
    enabled: true,
    channels: {
      tokens: "tokens",
      deployments: "deployments",
      chat: "chat"
    }
  }
};

export const deploymentConfig = {
  stages: [
    {
      id: "validation",
      name: "Validation",
      description: "Validating token parameters"
    },
    {
      id: "payment",
      name: "Payment", 
      description: "Processing payment"
    },
    {
      id: "creation",
      name: "Creation",
      description: "Creating token on blockchain"
    },
    {
      id: "metadata",
      name: "Metadata",
      description: "Uploading token metadata"
    },
    {
      id: "deployment",
      name: "Deployment",
      description: "Finalizing deployment"
    },
    {
      id: "completion",
      name: "Completion",
      description: "Token successfully deployed"
    }
  ],
  timeouts: {
    payment: 30 * 60 * 1000, // 30 minutes
    deployment: 5 * 60 * 1000, // 5 minutes
    metadata: 2 * 60 * 1000, // 2 minutes
  }
};

export const uiConfig = {
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500
    },
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536
  },
  colors: {
    primary: {
      50: "#faf5ff",
      100: "#f3e8ff", 
      500: "#a855f7",
      600: "#9333ea",
      700: "#7c3aed",
      900: "#581c87"
    }
  }
};

export const securityConfig = {
  cors: {
    allowedOrigins: [
      "http://localhost:3000",
      "https://optik.vercel.app",
      process.env.NEXT_PUBLIC_APP_URL
    ].filter(Boolean),
    allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400
  },
  rateLimit: {
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // requests per window
    },
    chat: {
      windowMs: 60 * 1000, // 1 minute  
      max: 10 // requests per window
    },
    payment: {
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 5 // requests per window
    }
  },
  validation: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ["image/jpeg", "image/png", "image/webp"],
    maxStringLength: 10000,
    sanitization: true
  }
};