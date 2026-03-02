declare module "elysia/context" {
  interface Context {
    signUser: (payload: {
      sub: string;
      restaurantId?: string;
    }) => Promise<void>;
    signOut: () => void;
    getCurrentUser: () => Promise<{
      userId: string;
      restaurantId?: string;
    }>;
  }
}
