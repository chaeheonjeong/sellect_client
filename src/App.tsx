import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { AuthProvider, useAuth } from '@context/AuthContext.jsx';
import Navbar from '@components/Navbar.jsx';
import HomePage from '@pages/Home/HomePage.tsx';

// Auth
import SignUpPage from '@pages/SignUp/SignUpPage.tsx';
import LoginPage from '@pages/Login/LoginPage.tsx';

// Profile
import ProfilePage from '@pages/Profile/ProfilePage.tsx';
import LeaveAccountPage from '@pages/Profile/leave/LeaveAccountPage.tsx';
import CouponPage from '@pages/Profile/coupons/CouponPage.tsx';
import PaymentHistoryPage from '@pages/Profile/paymentHistory/PaymentHistoryPage.tsx';
import { OrderHistoryPage, OrderDetailPage } from '@pages/Profile/orders';

// Product
import { ProductListPage, ProductDetailPage } from '@pages/Product';

// Order
import {
  OrderFormPage,
  OrderCompletePage,
  PaymentSuccessPage,
} from '@pages/Order';

// Coupon & Cart
import CouponDownloadPage from '@pages/Coupon/CouponDownloadPage.jsx';
import CartPage from '@pages/Cart/CartPage.tsx';

// Seller
import SellerProductDetail from '@pages/seller/SellerProductDetail.jsx';
import ProductEdit from '@pages/seller/ProductEdit.jsx';
import SellerDashboard from '@pages/seller/SellerDashboard.jsx';
import CouponUpload from '@pages/seller/CouponUpload.jsx';
import ProductRegister from '@pages/seller/ProductRegister.jsx';
import SellerHome from '@pages/seller/SellerHome.jsx';

// Error
import NotFoundPage from '@pages/Error/NotFoundPage.js';
import UnauthorizedPage from '@pages/Error/UnauthorizedPage.tsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='min-h-screen bg-gray-50'>
          <Navbar />
          <Routes>
            {/* GUEST, USER 전용 */}
            <Route
              path='/'
              element={
                <RouteGuard
                  component={HomePage}
                  allowedRoles={['GUEST', 'USER']}
                  defaultRedirect='/home'
                />
              }
            />
            <Route
              path='/home'
              element={
                <RouteGuard
                  component={HomePage}
                  allowedRoles={['GUEST', 'USER']}
                />
              }
            />
            <Route
              path='/products'
              element={
                <RouteGuard
                  component={ProductListPage}
                  allowedRoles={['GUEST', 'USER']}
                />
              }
            />
            <Route
              path='/products/:productId'
              element={
                <RouteGuard
                  component={ProductDetailPage}
                  allowedRoles={['GUEST', 'USER']}
                />
              }
            />

            {/* SELLER 전용 */}
            <Route
              path='/seller'
              element={
                <RouteGuard component={SellerHome} allowedRoles={['SELLER']} />
              }
            />
            <Route
              path='/seller/products/register'
              element={
                <RouteGuard
                  component={ProductRegister}
                  allowedRoles={['SELLER']}
                />
              }
            />
            <Route
              path='/seller/products/:productId/edit'
              element={
                <RouteGuard component={ProductEdit} allowedRoles={['SELLER']} />
              }
            />
            <Route
              path='/seller/products/:productId'
              element={
                <RouteGuard
                  component={SellerProductDetail}
                  allowedRoles={['SELLER']}
                />
              }
            />
            <Route
              path='/seller/dashboard'
              element={
                <RouteGuard
                  component={SellerDashboard}
                  allowedRoles={['SELLER']}
                />
              }
            />
            <Route
              path='/coupon/upload'
              element={
                <RouteGuard
                  component={CouponUpload}
                  allowedRoles={['SELLER']}
                />
              }
            />

            {/* USER 전용 */}
            <Route
              path='/cart'
              element={
                <RouteGuard component={CartPage} allowedRoles={['USER']} />
              }
            />

            <Route
              path='/coupon'
              element={
                <RouteGuard
                  component={CouponDownloadPage}
                  allowedRoles={['USER']}
                />
              }
            />
            <Route
              path='/order/form'
              element={
                <RouteGuard component={OrderFormPage} allowedRoles={['USER']} />
              }
            />
            <Route
              path='/order/:orderId'
              element={
                <RouteGuard
                  component={OrderDetailPage}
                  allowedRoles={['USER']}
                />
              }
            />
            <Route
              path='/user/profile'
              element={
                <RouteGuard component={ProfilePage} allowedRoles={['USER']} />
              }
            >
              <Route
                path='orders'
                element={
                  <RouteGuard
                    component={OrderHistoryPage}
                    allowedRoles={['USER']}
                  />
                }
              />
              <Route
                path='payment-history'
                element={
                  <RouteGuard
                    component={PaymentHistoryPage}
                    allowedRoles={['USER']}
                  />
                }
              />
              <Route
                path='coupons'
                element={
                  <RouteGuard component={CouponPage} allowedRoles={['USER']} />
                }
              />
              <Route
                path='leave'
                element={
                  <RouteGuard
                    component={LeaveAccountPage}
                    allowedRoles={['USER']}
                  />
                }
              />
            </Route>
            <Route
              path='/payment/success'
              element={
                <RouteGuard
                  component={PaymentSuccessPage}
                  allowedRoles={['USER']}
                />
              }
            />
            <Route
              path='/order/complete'
              element={
                <RouteGuard
                  component={OrderCompletePage}
                  allowedRoles={['USER']}
                />
              }
            />

            {/* 인증 */}
            <Route
              path='/register'
              element={
                <RouteGuard component={SignUpPage} allowedRoles={['GUEST']} />
              }
            />
            <Route
              path='/login'
              element={
                <RouteGuard component={LoginPage} allowedRoles={['GUEST']} />
              }
            />
            <Route path='/unauthorized' element={<UnauthorizedPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

interface RouteGuardProps {
  component: React.ComponentType;
  allowedRoles: string[];
  defaultRedirect?: string;
}

// 통합된 라우팅 가드
function RouteGuard({
  component: Component, // Component로 변수명 할당
  allowedRoles,
  defaultRedirect,
}: RouteGuardProps) {
  const { isLoggedIn, role } = useAuth();

  // 권한 체크
  if (!allowedRoles.includes(role)) {
    if (isLoggedIn) {
      return <Navigate to={role === 'USER' ? '/home' : '/seller'} replace />;
    }
    return <Navigate to={defaultRedirect || '/home'} replace />;
  }

  return <Component />;
}

export default App;
