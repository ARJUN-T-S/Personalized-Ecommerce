import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectUser, ProtectAdmin } from './components/ProtectedRoute';

// Customer Pages
import Home from './pages/Home';
import Stores from './pages/Stores';
import StoreProducts from './pages/StoreProducts';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import AdminCategories from './pages/AdminCategories';
import AdminOrders from './pages/AdminOrders';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/stores" element={<Stores />} />
              <Route path="/store/:adminId" element={<StoreProducts />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<ProtectUser><Cart /></ProtectUser>} />
              <Route path="/checkout" element={<ProtectUser><Checkout /></ProtectUser>} />
              <Route path="/my-orders" element={<ProtectUser><MyOrders /></ProtectUser>} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/profile" element={<ProtectUser><Profile /></ProtectUser>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin/dashboard" element={<ProtectAdmin><AdminDashboard /></ProtectAdmin>} />
              <Route path="/admin/products" element={<ProtectAdmin><AdminProducts /></ProtectAdmin>} />
              <Route path="/admin/products/new" element={<ProtectAdmin><AddProduct /></ProtectAdmin>} />
              <Route path="/admin/products/edit/:id" element={<ProtectAdmin><EditProduct /></ProtectAdmin>} />
              <Route path="/admin/categories" element={<ProtectAdmin><AdminCategories /></ProtectAdmin>} />
              <Route path="/admin/orders" element={<ProtectAdmin><AdminOrders /></ProtectAdmin>} />

              {/* 404 Fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
