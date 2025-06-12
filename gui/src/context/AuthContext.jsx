import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Context'i oluştur
const AuthContext = createContext(null);

// 2. Tüm uygulamayı saracak olan Provider bileşenini oluştur
export function AuthProvider({ children }) {
  // Sayfa yenilendiğinde token'ı localStorage'dan al
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // token her değiştiğinde (login/logout olunca) bu effect çalışır
  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Geçersiz token:", error);
        // Hatalı token'ı temizle
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  // Login olduğunda çağrılacak fonksiyon
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Logout olduğunda çağrılacak fonksiyon
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // Sonsuz döngüyü engellemek için value nesnesini useMemo ile sarmala
  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Context'i kolayca kullanmak için bir custom hook
export function useAuth() {
  return useContext(AuthContext);
}
