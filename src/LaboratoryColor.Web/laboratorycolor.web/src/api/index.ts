export { apiClient } from './client';
export { authAPI } from './auth';
export { productsAPI } from './products';
export { categoriesAPI } from './categories';
export { suppliersAPI } from './suppliers';
export { purchaseOrdersAPI } from './purchaseOrders';
export { stockMovementsAPI } from './stockMovements';
export { discountsAPI } from './discounts';

export type {
    LoginRequest,
    RegisterRequest,
    RefreshTokenRequest,
} from './auth';

export type {
    CreateProductRequest,
    UpdateProductRequest,
} from './products';

export type {
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from './categories';

export type {
    CreateSupplierRequest,
    UpdateSupplierRequest,
} from './suppliers';

export type {
    PurchaseOrderStatus,
    CreatePurchaseOrderRequest,
    UpdatePurchaseOrderStatusRequest,
    ReceivePurchaseOrderRequest,
} from './purchaseOrders';

export type {
    StockMovementType,
    GetStockMovementsParams,
    GetStockSummaryParams,
    ProductStockHistory,
} from './stockMovements';

export type {
    DiscountType,
    DiscountRuleType,
    CreateDiscountRuleRequest,
    CreateDiscountRequest,
    UpdateDiscountRequest,
} from './discounts';