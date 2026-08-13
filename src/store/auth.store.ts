import { create } from "zustand";
import { User } from "@/types";
import { authApi } from "@/lib/api";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (emailOrPhone: string, password: string) => Promise<User>;
    register: (data: {
        fullName: string;
        email: string;
        phone: string;
        password: string;
    }) => Promise<{ userId: string; email: string }>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
    updateBalance: (balance: number) => void;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (emailOrPhone, password) => {
        const { data } = await authApi.login({ emailOrPhone, password });
        const user = data.data!.user;
        set({ user, isAuthenticated: true });
        return user;
    },

    register: async (formData) => {
    // Register now returns userId and email for OTP verification
    // Tokens are issued after OTP verification
    // This function is kept for mobile app compatibility
    const { data } = await authApi.register(formData);
    return data.data!;
    },

    logout: async () => {
        try {
        await authApi.logout();
        } catch {
        // ignore
        }
        set({ user: null, isAuthenticated: false });
    },

    loadUser: async () => {
        try {
        const { data } = await authApi.getMe();
        set({
            user: data.data!,
            isAuthenticated: true,
            isLoading: false,
        });
        } catch {
        set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    updateBalance: (balance) => {
        const user = get().user;
        if (user) set({ user: { ...user, walletBalance: balance } });
    },

    setUser: (user) => {
        set({ user, isAuthenticated: true });
    },
}));