import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useState,
  useEffect,
} from "react";
import { getShopifyProducts } from "../services/shopify";

const init = {
  cards: [],
  cart: [],
  toasts: [],
  isAdmin: false,
  selectedCard: null,
  showCartDrawer: false,
  mobileMenuOpen: false,
  productsLoading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CARDS":
      return { ...state, cards: action.payload, productsLoading: false };

    case "SET_LOADING":
      return { ...state, productsLoading: action.payload };

    case "UC":
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.payload.id ? { ...card, ...action.payload.u } : card
        ),
      };

    case "AC":
      return { ...state, cards: [action.payload, ...state.cards] };

    case "DC":
      return {
        ...state,
        cards: state.cards.filter((card) => card.id !== action.payload),
      };

    case "ATC": {
      const addQty = action.payload.qtyToAdd || 1;
      const existing = state.cart.find((item) => item.id === action.payload.id);

      if (existing) {
        const newQty = Math.min(existing.qty + addQty, action.payload.stock || 99);
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id ? { ...item, qty: newQty } : item
          ),
        };
      }

      return {
        ...state,
        cart: [
          ...state.cart,
          {
            ...action.payload,
            qty: Math.min(addQty, action.payload.stock || 1),
          },
        ],
      };
    }

    case "RFC":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case "UQ":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, qty: Math.min(action.payload.qty, item.stock || 99) }
            : item
        ),
      };

    case "CC":
      return { ...state, cart: [] };

    case "TC":
      return { ...state, showCartDrawer: !state.showCartDrawer };

    case "SC":
      return { ...state, selectedCard: action.payload };

    case "TA":
      return { ...state, isAdmin: !state.isAdmin };

    case "TM":
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen };

    case "AT":
      return { ...state, toasts: [...state.toasts, action.payload] };

    case "RT":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };

    default:
      return state;
  }
}

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, init);

  const getTheme = () => {
    try {
      return localStorage.getItem("rjs-theme") || "light";
    } catch {
      return "light";
    }
  };

  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme);

    try {
      localStorage.setItem("rjs-theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((previous) => (previous === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const products = await getShopifyProducts();

        if (!cancelled) {
          dispatch({
            type: "SET_CARDS",
            payload: Array.isArray(products) ? products : [],
          });
        }
      } catch (error) {
        console.error("Failed to load Shopify products:", error);

        if (!cancelled) {
          dispatch({ type: "SET_CARDS", payload: [] });
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();

    dispatch({
      type: "AT",
      payload: {
        id,
        message,
        type,
      },
    });

    setTimeout(() => {
      dispatch({ type: "RT", payload: id });
    }, duration);
  }, []);

  const addToCart = useCallback(
    (product, qty = 1) => {
      if (!product?.variantGid) {
        showToast("This product is missing a Shopify variant", "error");
        return;
      }

      if (!product?.availableForSale || product.stock <= 0) {
        showToast("This product is not available", "error");
        return;
      }

      const inCart = state.cart.find((item) => item.id === product.id)?.qty || 0;

      if (inCart + qty > product.stock) {
        showToast(`Only ${product.stock} in stock (${inCart} in cart)`, "error");
        return;
      }

      dispatch({
        type: "ATC",
        payload: {
          ...product,
          qtyToAdd: qty,
        },
      });

      showToast(`${qty}x ${product.name} added`, "success");
    },
    [state.cart, showToast]
  );

  const value = {
    ...state,
    theme,
    toggleTheme,

    setCards: useCallback((cards) => {
      dispatch({ type: "SET_CARDS", payload: cards });
    }, []),

    updateCard: useCallback((id, u) => {
      dispatch({ type: "UC", payload: { id, u } });
    }, []),

    addCard: useCallback((card) => {
      dispatch({ type: "AC", payload: card });
    }, []),

    deleteCard: useCallback((id) => {
      dispatch({ type: "DC", payload: id });
    }, []),

    addToCart,

    removeFromCart: useCallback((id) => {
      dispatch({ type: "RFC", payload: id });
    }, []),

    updateCartQty: useCallback((id, qty) => {
      dispatch({ type: "UQ", payload: { id, qty } });
    }, []),

    clearCart: useCallback(() => {
      dispatch({ type: "CC" });
    }, []),

    toggleCart: useCallback(() => {
      dispatch({ type: "TC" });
    }, []),

    selectCard: useCallback((card) => {
      dispatch({ type: "SC", payload: card });
    }, []),

    toggleAdmin: useCallback(() => {
      dispatch({ type: "TA" });
    }, []),

    toggleMobileMenu: useCallback(() => {
      dispatch({ type: "TM" });
    }, []),

    showToast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useApp = () => {
  const context = useContext(Ctx);

  if (!context) {
    throw new Error("useApp needs AppProvider");
  }

  return context;
};