import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTwapContext } from "../../context/context";
import { Translations } from "../../types";
import { OrdersMenuTab } from "./types";
import { mapCollection, size } from "../../utils";
import { groupOrdersByStatus, Order, OrderStatus } from "@orbs-network/twap-sdk";
import { useOrdersHistory } from "../../hooks/query";
import { eqIgnoreCase } from "@defi.org/web3-candies";

interface OrderHistoryContextType {
  tabs: OrdersMenuTab[];
  selectOrder: (id: number | undefined) => void;
  orders: Order[];
  setTab: (tab: OrderStatus) => void;
  closePreview: () => void;
  selectedTab?: OrdersMenuTab;
  isLoading: boolean;
  selectedOrderId?: number;
}

export const useTokenFromList = (address?: string) => {
  const { tokens, useParsedToken } = useTwapContext();
  const _token = useParsedToken?.(address);

  const result = useMemo(() => {
    if (!address || !tokens) return;
    return tokens.find((t) => eqIgnoreCase(address, t.address));
  }, [tokens, address]);
  return result || _token;
};

export const useSelectedOrder = () => {
  const orders = useOrders();

  const { selectedOrderId } = useOrderHistoryContext();

  return useMemo(() => {
    if (!orders || !selectedOrderId) return;
    return orders.find((it) => it.id === selectedOrderId);
  }, [orders, selectedOrderId]);
};
export const OrderHistoryContext = createContext({} as OrderHistoryContextType);

const useOrders = () => {
  const { data } = useOrdersHistory();

  return useMemo(() => {
    return data;
  }, [data]);
};

const useSelectedOrders = (status: OrderStatus) => {
  const orders = useOrders();
  if (!orders) {
    return [];
  }
  const grouped = groupOrdersByStatus(orders);
  return grouped?.[status] || [];
};

export const OrderHistoryContextProvider = ({ children, isOpen }: { children: ReactNode; isOpen: boolean }) => {
  const [tab, setTab] = useState<OrderStatus>(OrderStatus.All);
  const [selectedOrderId, setSelectedOrderId] = useState<number | undefined>(undefined);
  const orders = useSelectedOrders(tab);
  const isLoading = !orders;

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSelectedOrderId(undefined);
        setTab(OrderStatus.All);
      }, 300);
    }
  }, [isOpen]);

  const selectOrder = useCallback(
    (id: number | undefined) => {
      setSelectedOrderId(id);
    },
    [setSelectedOrderId],
  );

  const closePreview = useCallback(() => {
    setSelectedOrderId(undefined);
  }, [setSelectedOrderId]);

  const translations = useTwapContext().translations;
  const tabs = useMemo(() => {
    return mapCollection(OrderStatus, (it) => {
      return {
        name: it,
        amount: size(orders?.[it as any]),
        key: it,
      };
    });
  }, [orders, translations]);

  const selectedTab = useMemo(
    () =>
      tabs.find((it) => {
        return it.key === tab;
      }),
    [tabs, tab],
  );

  return (
    <OrderHistoryContext.Provider value={{ selectedOrderId, tabs, selectOrder, orders, setTab, closePreview, selectedTab, isLoading }}>{children}</OrderHistoryContext.Provider>
  );
};

export const useOrderHistoryContext = () => {
  return useContext(OrderHistoryContext);
};
