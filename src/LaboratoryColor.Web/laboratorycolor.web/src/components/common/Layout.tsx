import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';

import {
    CubeIcon,
    FolderIcon,
    TruckIcon,
    ShoppingCartIcon,
    ChartBarIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Products', href: '/products', icon: CubeIcon },
    { name: 'Categories', href: '/categories', icon: FolderIcon },
    { name: 'Suppliers', href: '/suppliers', icon: TruckIcon },
    { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCartIcon },
    { name: 'Stock Movements', href: '/stock-movements', icon: ChartBarIcon },
];

export const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-sm">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center h-16 px-6 border-b border-gray-200">
                        <Link to="/" className="flex items-center space-x-2">
                            <CubeIcon className="w-8 h-8 text-primary-600" />
                            <span className="text-lg font-semibold text-gray-900">
                                AutoColor
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 group"
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    <span className="text-sm font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User info */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3">
                            <UserCircleIcon className="w-8 h-8 text-gray-400" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.userName || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email || ''}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-1 text-gray-400 hover:text-gray-600"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="pl-64">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};