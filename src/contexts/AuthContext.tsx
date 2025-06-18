"use client";

import { TokenManager } from "@/lib/auth";
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
  login: (token: string, user?: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

type AuthAction =
  | { type: "LOGIN"; payload: { token: string; user?: User } }
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
        user: action.payload.user || state.user,
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

  const login = (token: string, user?: User) => {
    TokenManager.setToken(token);
    dispatch({ type: "LOGIN", payload: { token, user } });
  };

  const logout = () => {
    TokenManager.removeToken();
    dispatch({ type: "LOGOUT" });
  };

  const setUser = (user: User) => {
    dispatch({ type: "SET_USER", payload: user });
  };

  useEffect(() => {
    const initAuth = () => {
      const token = TokenManager.getToken();

      if (token) {
        // For temporary/mock tokens, don't validate JWT format
        if (token.startsWith("temp_token_")) {
          dispatch({ type: "LOGIN", payload: { token } });
        } else {
          // For real JWT tokens, validate them
          const isValid = TokenManager.isTokenValid();
          if (isValid) {
            dispatch({ type: "LOGIN", payload: { token } });
          } else {
            TokenManager.removeToken();
            dispatch({ type: "SET_LOADING", payload: false });
          }
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
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
