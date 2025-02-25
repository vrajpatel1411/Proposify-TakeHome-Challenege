import { createContext, useContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  console.log(context);
  return context;
};

export default useAuth;
