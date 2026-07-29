// ─── User ────
export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
    isVerified: boolean;
    walletBalance: number;
    createdAt: string;
}

// ─── API Response ───
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    meta?: PaginationMeta;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ─── Auth ──────────
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface RegisterDto {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

// ─── Wallet ───────────
export interface Wallet {
    balance: number;
    currency: string;
    virtualAccount: {
        accountNumber: string | null;
        bankName: string | null;
    };
}

// ─── Transaction ───────────
export type TransactionType =
    | "AIRTIME_PURCHASE"
    | "DATA_PURCHASE"
    | "AIRTIME_CONVERSION"
    | "WALLET_FUNDING"
    | "WITHDRAWAL"
    | "REFUND";

export type TransactionStatus =
    | "PENDING" 
    | "SUCCESS"
    | "FAILED"
    | "REVERSED";

export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
    reference: string;
    description?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}

// ─── Conversion ───────────
export type Network = "MTN" | "AIRTEL" | "GLO" | "NINE_MOBILE";
export type ConversionStatus =
    | "PENDING"
    | "VERIFYING"
    | "COMPLETED"
    | "FAILED"
    | "REJECTED";

export interface AirtimeConversion {
    id: string;
    network: Network;
    airtimeAmount: number;
    conversionRate: number;
    cashValue: number;
    status: ConversionStatus;
    transferNumber?: string;
    createdAt: string;
}

// ─── Withdrawal ────────
export type WithdrawalStatus =
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED";

export interface Withdrawal {
    id: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
    status: WithdrawalStatus;
    reference: string;
    createdAt: string;
}

// ─── Notification ───────────
export interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    type: "info" | "success" | "warning" | "error";
    createdAt: string;
}

// ─── Conversion Rate ─────────────────────────────────
export interface ConversionRate {
    id: string;
    network: Network;
    rate: number;
    isActive: boolean;
}

// ─── Bank ────────────────────────────────────────────
export interface Bank {
    name: string;
    code: string;
    slug: string;
}