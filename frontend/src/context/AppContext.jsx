import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

const API_URL = "http://localhost:5000/api";

export const AppProvider = ({ children }) => {
  // -------------------- USER STATE --------------------
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // -------------------- CART STATE --------------------
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // -------------------- SENSOR / DASHBOARD DATA --------------------
  const [currentData, setCurrentData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [aqi, setAqi] = useState(null);

  // -------------------- PERSIST DATA --------------------
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // -------------------- CART FUNCTIONS --------------------
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // -------------------- USER AUTH HELPERS (For Later) --------------------
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const registerUser = (userData) => {
    // Future: post to backend /api/register
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // -------------------- API FETCHING --------------------
  const fetchAllData = useCallback(async () => {
    try {
      const [currentRes, historyRes, aqiRes] = await Promise.all([
        fetch(`${API_URL}/current`),
        fetch(`${API_URL}/history?limit=50`),
        fetch(`${API_URL}/aqi`),
      ]);

      const [currentJson, historyJson, aqiJson] = await Promise.all([
        currentRes.json(),
        historyRes.json(),
        aqiRes.json(),
      ]);

      if (currentJson.success) setCurrentData(currentJson);
      if (historyJson.success) setHistoryData(historyJson.data || []);
      if (aqiJson.success) setAqi(aqiJson.aqi);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // -------------------- CONTEXT VALUE --------------------
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        loginUser,
        logoutUser,
        registerUser,

        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalItems,

        currentData,
        historyData,
        aqi,
        fetchAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
