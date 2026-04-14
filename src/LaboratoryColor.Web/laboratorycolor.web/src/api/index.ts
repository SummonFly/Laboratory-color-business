export { apiClient } from './client';
export { authAPI } from './auth';
export { productsAPI } from './products';
export { categoriesAPI } from './categories';
export { suppliersAPI } from './suppliers';
export { purchaseOrdersAPI } from './purchaseOrders';
export { stockMovementsAPI } from './stockMovements';
export { discountsAPI } from './discounts';
export { dashboardAPI } from './dashboard';
export { ordersAPI } from './orders';
export { devAPI } from './dev';
export type { PurchaseOrder, PurchaseOrderItem } from '../types';

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
    CreatePurchaseOrderItemRequest,
    UpdatePurchaseOrderStatusRequest,
    ReceivePurchaseOrderRequest,
    GetPurchaseOrdersParams,
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
    GetDiscountsParams,
    CreateCouponRequest,
    ValidateCouponResponse,
} from './discounts';

export type {
    DashboardDto,
    StockSummaryDto,
    SalesSummaryDto,
    PopularProductDto,
    LowStockProductDto,
    GetDashboardParams,
} from './dashboard';

export type {
    OrderDto,
    OrderItemDto,
    OrderStatus,
    GetOrdersParams,
    UpdateOrderStatusRequest,
} from './orders';

export type {
    TestDataStatusDto,
    OperationResultDto,
} from './dev';