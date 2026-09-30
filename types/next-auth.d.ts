import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    subscriptionStatus: "FREE" | "MONTHLY" | "YEARLY" | "LIFETIME";
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      subscriptionStatus: "FREE" | "MONTHLY" | "YEARLY" | "LIFETIME";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    subscriptionStatus: "FREE" | "MONTHLY" | "YEARLY" | "LIFETIME";
  }
}
