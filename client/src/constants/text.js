export const BRANDING = {
    name: "TrustLayer",
    tagline: "Blockchain-Powered Certificate Verification",
    description:
        "A decentralized system to issue, store, and verify academic certificates using Ethereum blockchain. Tamper-proof. Trustless. Transparent.",
    features: [
        {
            title: "SHA-256 Hashing",
            description: "Cryptographic hash of every certificate stored on Ethereum Sepolia",
            color: "bg-teal-500",
            icon: "Hash",
        },
        {
            title: "Instant Verification",
            description: "Upload certificate, blockchain confirms authenticity in seconds",
            color: "bg-teal-500",
            icon: "Zap",
        },
        {
            title: "Role-Based Access",
            description: "Secure portals for Universities, Employers & Admins",
            color: "bg-teal-500",
            icon: "ShieldCheck",
        },
    ],
};

export const AUTH_MESSAGES = {
    welcomeBack: "Welcome back",
    signInPrompt: "Sign in to your account",
    createAccount: "Create Account",
    getStarted: "Get started with TrustLayer",
    checkEmail: "Check your email",
    verificationSent: (email) => `We've sent a verify link to ${email}`,
};
