import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import Navbar from '@components/Navbar.jsx';
import HomePage from '@pages/Home/index.ts';
import SignUpPage from '@pages/SignUp/index.ts';
import ProductList from '@pages/product/ProductList.jsx';
import ProductDetail from '@pages/product/ProductDetail.jsx';
import CouponDownloadPage from '@pages/Coupon/index.ts';
import CartPage from '@pages/Cart/index.ts';
import OrderHistoryPage from '@pages/Profile/orders/index.ts';
import OrderDetailPage from '@pages/Profile/orders/OrderDetailPage.tsx';
import ProfilePage from '@pages/Profile/index.js';
import ProductRegister from '@pages/seller/ProductRegister.jsx';
import SellerHome from '@pages/seller/SellerHome.jsx';
import LoginPage from '@pages/Login/index.ts';
import { AuthProvider, useAuth } from '@context/AuthContext.jsx';
import UnauthorizedPage from '@pages/Error/UnauthorizedPage.tsx';
import OrderForm from '@pages/OrderForm.jsx';
import CouponUpload from '@pages/seller/CouponUpload.jsx';
import PaymentHistoryPage from '@pages/Profile/paymentHistory/PaymentHistoryPage';
import LeaveAccountPage from '@/pages/Profile/leave/index.ts';
import PaymentSuccess from '@pages/PaymentSuccess.jsx';
import OrderComplete from '@pages/OrderComplete.jsx';
import SellerDashboard from '@pages/seller/SellerDashboard.jsx';
import NotFoundPage from '@pages/Error/NotFoundPage.js';
import SellerProductDetail from '@pages/seller/SellerProductDetail.jsx';
import ProductEdit from '@pages/seller/ProductEdit.jsx';

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
                  component={ProductList}
                  allowedRoles={['GUEST', 'USER']}
                />
              }
            />
            <Route
              path='/products/:productId'
              element={
                <RouteGuard
                  component={ProductDetail}
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
                <RouteGuard component={OrderForm} allowedRoles={['USER']} />
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
                  <RouteGuard
                    component={CouponDownloadPage}
                    allowedRoles={['USER']}
                  />
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
                  component={PaymentSuccess}
                  allowedRoles={['USER']}
                />
              }
            />
            <Route
              path='/order/complete'
              element={
                <RouteGuard component={OrderComplete} allowedRoles={['USER']} />
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
