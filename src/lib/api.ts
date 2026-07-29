import axios from "axios";
import { ApiResponse, LoginResponse, User, Wallet, Transaction, AirtimeConversion, Withdrawal, Notification, ConversionRate, Bank } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // browser sends cookies automatically
    timeout: 15000,
});

// ─── Response interceptor ───
// Auto refreshes token when it expires
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        // Don't redirect if already on auth pages
        const authRoutes = ["/auth/login", "/auth/register"];
        const isAuthRoute = authRoutes.some((route) =>
        window.location.pathname.startsWith(route)
        );

        // Don't refresh tokens for auth endpoints
        const isAuthEndpoint = original.url?.includes("/auth/");

        if (
            error.response?.status === 401 &&
            !original._retry &&
            !isAuthRoute &&
            !isAuthEndpoint
        ) {
        original._retry = true;

        try {
            await axios.post(
                `${API_URL}/auth/refresh`,
                {},
                { withCredentials: true }
            );
            return api(original);
        } catch {
            window.location.href = "/auth/login";
        }
        }

        return Promise.reject(error);
    }
);



// ─── Auth ───────────
export const authApi = {
    register: (data: {
        fullName: string;
        email: string;
        phone: string;
        password: string;
    }) => api.post<ApiResponse<LoginResponse>>("/auth/register", data),

    login: (data: { emailOrPhone: string; password: string }) =>
        api.post<ApiResponse<LoginResponse>>("/auth/login", data),

    logout: () => api.post<ApiResponse<null>>("/auth/logout"),

    getMe: () => api.get<ApiResponse<User>>("/auth/me"),
};

// ─── Wallet ─────────────────
export const walletApi = {
    getWallet: () => api.get<ApiResponse<Wallet>>("/wallet"),
    getVirtualAccount: () => api.get<ApiResponse<Wallet>>("/wallet/virtual-account"),
};

// ─── Airtime ────────────────
export const airtimeApi = {
    buy: (data: { network: string; phone: string; amount: number }) =>
    api.post<ApiResponse<{
        reference: string;
        network: string;
        phone: string;
        amount: number;
        status: string;
    }>>("/airtime/buy", data),
    history: () => api.get<ApiResponse<AirtimeConversion[]>>("/airtime/history"),
};

// ─── Data ───────────────
export const dataApi = {
    getPlans: (network: string) =>
        api.get<ApiResponse<{ code: string; name: string; amount: number }[]>>(
        `/data/plans/${network}`
        ),
    buy: (data: { network: string; phone: string; planCode: string }) =>
    api.post<ApiResponse<{
        reference: string;
        network: string;
        phone: string;
        plan: string;
        amount: number;
        status: string;
    }>>("/data/buy", data),
    history: () => api.get<ApiResponse<null>>("/data/history"),
};

// ─── Conversion ────────────────
export const conversionApi = {
    getRates: () => api.get<ApiResponse<ConversionRate[]>>("/conversions/rates"),
    initiate: (data: { network: string; airtimeAmount: number }) =>
        api.post<ApiResponse<{
        conversionId: string;
        network: string;
        airtimeAmount: number;
        cashValue: number;
        rate: number;
        transferNumber: string;
        expiresIn: string;
        }>>("/conversions/initiate", data),
    verify: (conversionId: string) =>
        api.post<ApiResponse<{
        conversionId: string;
        cashValue: number;
        status: string;
        }>>(`/conversions/verify/${conversionId}`),
    getAll: () => api.get<ApiResponse<AirtimeConversion[]>>("/conversions"),
};

// ─── Withdrawal ─────────────
export const withdrawalApi = {
    request: (data: {
        amount: number;
        bankName: string;
        bankCode: string;
        accountNumber: string;
        accountName: string;
        transactionPin: string;
    }) => api.post<ApiResponse<Withdrawal>>("/withdrawals", data),
    getAll: () => api.get<ApiResponse<Withdrawal[]>>("/withdrawals"),
    setPin: (pin: string) =>
        api.post<ApiResponse<null>>("/withdrawals/set-pin", { pin }),
};

// ─── Users ───────────
export const userApi = {
    getSecurity: () =>
        api.get<ApiResponse<{ hasPin: boolean; isVerified: boolean; }>>("/users/security"),
    updateProfile: (data: { fullName?: string; phone?: string }) =>
        api.patch<ApiResponse<User>>("/users/profile", data),
    changePassword: (data: { currentPassword: string; newPassword: string;}) => 
        api.patch<ApiResponse<null>>("/users/change-password", data),
    setPin: (pin: string) =>
        api.post<ApiResponse<null>>("/withdrawals/set-pin", { pin }),
};

// ─── Bank ────────────────
export const bankApi = {
    getAll: () => api.get<ApiResponse<Bank[]>>("/banks"),
    verifyAccount: (data: { accountNumber: string; bankCode: string }) =>
        api.post<ApiResponse<{ accountName: string; accountNumber: string }>>("/banks/verify", data),
};

// ─── Transactions ────────────
export const transactionApi = {
    getAll: (params?: {
        page?: number;
        limit?: number;
        type?: string;
        status?: string;
    }) => api.get<ApiResponse<Transaction[]>>("/transactions", { params }),
    getById: (id: string) =>
        api.get<ApiResponse<Transaction>>(`/transactions/${id}`),
};

// ─── Notifications ────────────
export const notificationApi = {
    getAll: () => api.get<ApiResponse<{
        notifications: Notification[];
        unreadCount: number;
    }>>("/notifications"),
    markAllRead: () => api.patch<ApiResponse<null>>("/notifications/read-all"),
    markRead: (id: string) =>
        api.patch<ApiResponse<null>>(`/notifications/${id}/read`),
};

// ─── Admin ──────────────────
export const adminApi = {
    getAnalytics: () => api.get<ApiResponse<{
        totalUsers: number;
        activeUsers: number;
        totalTransactions: number;
        successfulConversions: number;
        pendingWithdrawals: number;
        totalVolume: number;
    }>>("/admin/analytics"),
    getUsers: (params?: { page?: number; search?: string }) =>
        api.get<ApiResponse<User[]>>("/admin/users", { params }),
    toggleUser: (id: string) =>
        api.patch<ApiResponse<{ isActive: boolean }>>(
        `/admin/users/${id}/toggle-status`
        ),
    getPendingConversions: () =>
        api.get<ApiResponse<AirtimeConversion[]>>("/admin/conversions/pending"),
    approveConversion: (id: string) =>
        api.patch<ApiResponse<null>>(`/admin/conversions/${id}/approve`),
    rejectConversion: (id: string) =>
        api.patch<ApiResponse<null>>(`/admin/conversions/${id}/reject`),
    updateRate: (data: { network: string; rate: number }) =>
        api.patch<ApiResponse<ConversionRate>>("/admin/rates", data),
};

export default api;