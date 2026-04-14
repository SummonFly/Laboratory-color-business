// ============= Auth =============
export interface ApplicationUser {
    id: string;
    userName: string;
    email?: string | null;
    refreshToken?: string | null;
    refreshTokenExpiryTime?: string | null; // DateTime from .NET
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    expiresAt: string; // DateTime from .NET
    userId: string;
    userName: string;
    email: string;
    roles: string[];
}

export interface IdentityResult {
    succeeded: boolean;
    errors: string[];
}

// ============= Categories =============
export interface Category {
    id: number;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    productsCount: number;
}

// ============= Products =============
export interface Product {
    id: number;
    name: string;
    price: number;
    currentStock: number;
    categoryId: number;
    categoryName?: string | null;
    description?: string | null;
}

// ============= Suppliers =============
export interface Supplier {
    id: number;
    name: string;
    contactPerson?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    inn?: string | null;
    bankDetails?: string | null;
    isActive: boolean;
    purchaseOrdersCount: number;
}

// ============= Purchase Orders =============
export type PurchaseOrderStatus = 'Pending' | 'Shipped' | 'Received' | 'Cancelled';

export interface PurchaseOrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    receivedQuantity: number;
    isFullyReceived: boolean;
}

export interface PurchaseOrder {
    id: number;
    supplierId: number;
    supplierName: string;
    orderNumber: string;
    status: PurchaseOrderStatus;
    orderedDate: string; // DateTime
    expectedDeliveryDate?: string | null;
    actualDeliveryDate?: string | null;
    totalAmount: number;
    notes?: string | null;
    items: PurchaseOrderItem[];
}

// ============= Stock Movements =============
export type StockMovementType = 'In' | 'Out' | 'Adjustment';

export interface StockMovement {
    id: number;
    productId: number;
    productName: string;
    productSku: string;
    quantity: number;
    movementType: StockMovementType;
    referenceId?: number | null;
    referenceNumber?: string | null;
    reason?: string | null;
    createdAt: string; // DateTime
    createdBy?: string | null;
}

export interface StockMovementSummary {
    productId: number;
    productName: string;
    totalIn: number;
    totalOut: number;
    currentStock: number;
}

// ============= Discounts =============
export type DiscountType = 'Percentage' | 'FixedAmount';
export type DiscountRuleType = 'All' | 'Category' | 'Product' | 'AttributeValue' | 'CustomerRole' | 'TotalAmount';

export interface DiscountRule {
    id: number;
    ruleType: DiscountRuleType;
    ruleValue: string;
}

export interface Coupon {
    id: number;
    code: string;
    usageLimit?: number | null;
    usedCount: number;
    userId?: string | null;
    isActive: boolean;
}

export interface Discount {
    id: number;
    name: string;
    description?: string | null;
    discountType: DiscountType;
    discountValue: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    priority: number;
    rules: DiscountRule[];
    coupons: Coupon[];
}

// ============= Common API Response =============
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

// ============= Pagination =============
export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}