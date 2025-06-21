"use client";

import AuthAPI, { TokenManager } from "@/lib/auth";
import { User } from "@/types/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, user?: User | null) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

type AuthAction =
  | { type: "LOGIN"; payload: { user: User } }
  | { type: "LOGOUT" }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_LOADING"; payload: boolean };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await AuthAPI.getProfile();
      if (response.data) {
        dispatch({
          type: "SET_USER",
          payload: response.data,
        });
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      // Jika gagal ambil profile, logout user
      logout();
    }
  };

  const login = async (token: string, user?: User | null): Promise<void> => {
    TokenManager.setToken(token);

    let finalUser = user;

    // Jika user tidak diberikan, coba ambil dari backend
    if (!finalUser) {
      try {
        const response = await AuthAPI.getProfile();
        finalUser = response.data;
      } catch (error) {
        // Fallback ke token extraction
        finalUser = TokenManager.getUserFromToken();
      }
    }

    if (finalUser) {
      dispatch({
        type: "LOGIN",
        payload: {
          user: finalUser,
        },
      });
    } else {
      throw new Error("Unable to get user information");
    }
  };

  const logout = () => {
    TokenManager.removeToken();
    dispatch({
      type: "LOGOUT",
    });
  };

  const setUser = (user: User) => {
    dispatch({
      type: "SET_USER",
      payload: user,
    });
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = TokenManager.getToken();

      if (token && TokenManager.isTokenValid()) {
        try {
          // Prioritaskan mengambil data user dari backend
          const response = await AuthAPI.getProfile();
          if (response.data) {
            dispatch({
              type: "LOGIN",
              payload: {
                user: response.data,
              },
            });
          } else {
            throw new Error("No user data from backend");
          }
        } catch (error) {
          console.error("Failed to get user profile:", error);

          // Fallback ke token extraction untuk development
          const userFromToken = TokenManager.getUserFromToken();
          if (userFromToken) {
            dispatch({
              type: "LOGIN",
              payload: {
                user: userFromToken,
              },
            });
          } else {
            // Token invalid atau tidak bisa ekstrak user
            TokenManager.removeToken();
            dispatch({
              type: "SET_LOADING",
              payload: false,
            });
          }
        }
      } else {
        // No token atau token invalid
        TokenManager.removeToken();
        dispatch({
          type: "SET_LOADING",
          payload: false,
        });
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        setUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
