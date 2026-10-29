import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Layout } from './components/common/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { StockMovementsPage } from './pages/StockMovementsPage';
import { PurchaseOrdersPage } from './pages/PurchaseOrdersPage';
import { DiscountsPage } from './pages/DiscountsPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { DevPanelPage } from './pages/DevPanelPage';
import { SimulationPanelPage } from './pages/SimulationPanelPage';


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
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/suppliers" element={<SuppliersPage />} />
                        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
                        <Route path="/stock-movements" element={<StockMovementsPage />} />
                        <Route path="/discounts" element={<DiscountsPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/dev" element={<DevPanelPage />} />
                        <Route path="/simulation" element={<SimulationPanelPage />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={
                        <div className="min-h-screen flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <h1 className="text-6xl font-bold text-black">404</h1>
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