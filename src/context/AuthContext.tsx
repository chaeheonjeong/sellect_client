import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  PropsWithChildren,
} from 'react';
import axios, { AxiosError } from 'axios';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface User {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: string | null;
  role: string;
  cartItemCount: number;
}

interface AuthContextType extends User {
  login: (accessToken: string, user: string, role: string) => Promise<void>;
  logout: () => void;
  updateCartCount: () => Promise<void>;
}

type Action =
  | {
      type: 'LOGIN';
      payload: Omit<User, 'isLoggedIn'>;
    }
  | {
      type: 'LOGOUT';
    }
  | {
      type: 'UPDATE_CART_COUNT';
      payload: number;
    };

const initialState: User = {
  isLoggedIn: false,
  accessToken: null,
  user: null,
  role: 'GUEST',
  cartItemCount: 0, // 장바구니 개수 추가
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authReducer(state: User, action: Action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        accessToken: action.payload.accessToken,
        user: action.payload.user,
        role: action.payload.role,
        cartItemCount: action.payload.cartItemCount || 0, // 로그인 시 초기 개수 설정
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        accessToken: null,
        user: null,
        role: 'GUEST',
        cartItemCount: 0, // 로그아웃 시 개수 초기화
      };
    case 'UPDATE_CART_COUNT':
      return {
        ...state,
        cartItemCount: action.payload,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(authReducer, initialState, () => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : initialState;
  });

  useEffect(() => {
    try {
      localStorage.setItem('auth', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [state]);

  const login = async (accessToken: string, user: string, role: string) => {
    if (!accessToken) {
      console.warn('No accessToken provided to login');
    }
    let cartItemCount = 0;
    try {
      const response = await axios.get(
        `${VITE_API_BASE_URL}/api/v1/carts/count`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      cartItemCount = response.data.result || 0;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        'Cart API error:',
        axiosError.response?.status,
        axiosError.message
      );
    }
    dispatch({
      type: 'LOGIN',
      payload: { accessToken, user, role, cartItemCount },
    });
  };

  const logout = (): void => {
    console.log('Logging out');
    dispatch({ type: 'LOGOUT' });
  };

  const updateCartCount = async () => {
    try {
      const response = await axios.get(
        `${VITE_API_BASE_URL}/api/v1/carts/count`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${state.accessToken}` },
        }
      );
      const cartItemCount = response.data.result || 0;
      dispatch({ type: 'UPDATE_CART_COUNT', payload: cartItemCount });
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateCartCount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다.');
  }
  return context;
}
