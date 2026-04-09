import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Layout } from './components/common/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const ProductsPage = () => (
    <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="mt-2 text-gray-600">Products list will appear here</p>
    </div>
);

const CategoriesPage = () => (
    <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="mt-2 text-gray-600">Categories list will appear here</p>
    </div>
);

const SuppliersPage = () => (
    <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
        <p className="mt-2 text-gray-600">Suppliers list will appear here</p>
    </div>
);

const PurchaseOrdersPage = () => (
    <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
        <p className="mt-2 text-gray-600">Purchase orders list will appear here</p>
    </div>
);

const StockMovementsPage = () => (
    <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock Movements</h1>
        <p className="mt-2 text-gray-600">Stock movements history will appear here</p>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected routes with layout */}
                    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route path="/" element={<Navigate to="/products" replace />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/suppliers" element={<SuppliersPage />} />
                        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
                        <Route path="/stock-movements" element={<StockMovementsPage />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={
                        <div className="min-h-screen flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <h1 className="text-6xl font-bold text-gray-900">404</h1>
                                <p className="mt-2 text-gray-600">Page not found</p>
                                <Link to="/" className="mt-4 inline-block text-primary-600 hover:text-primary-500">
                                    Go home
                                </Link>
                            </div>
                        </div>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;