import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Order, OrderStatus } from "@orbs-network/twap-sdk";
import { useAccountOrders, useGroupedByStatusOrders } from "../../../hooks/order-hooks";

export type OrdersMenuTab = {
  name: string;
  amount: number;
  key: any;
};

interface OrderHistoryContextType {
  selectOrder: (id: number | undefined) => void;
  selectedOrders: Order[];
  closePreview: () => void;
  isLoading: boolean;
  selectedOrderId?: number;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  setStatus: (status: OrderStatus) => void;
  status: OrderStatus;
}

export const useSelectedOrder = () => {
  const orders = useAccountOrders().data;

  const { selectedOrderId } = useOrderHistoryContext();

  return useMemo(() => {
    if (!orders || !selectedOrderId) return;
    return orders.find((it) => it.id === selectedOrderId);
  }, [orders, selectedOrderId]);
};
export const OrderHistoryContext = createContext({} as OrderHistoryContextType);

export const OrderHistoryContextProvider = ({ children }: { children: ReactNode }) => {
  const groupedOrders = useGroupedByStatusOrders();
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.All);
  const { isLoading } = useAccountOrders();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | undefined>(undefined);
  const selectedOrders = groupedOrders[status] || [];

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSelectedOrderId(undefined);
        setStatus(OrderStatus.All);
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

  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpen = useCallback(() => setIsOpen(true), []);

  return (
    <OrderHistoryContext.Provider value={{ selectedOrderId, selectOrder, selectedOrders, setStatus, closePreview, status, isLoading, isOpen, onClose, onOpen }}>
      {children}
    </OrderHistoryContext.Provider>
  );
};

export const useOrderHistoryContext = () => {
  return useContext(OrderHistoryContext);
};
