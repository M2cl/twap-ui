import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Order } from "@orbs-network/twap-sdk";
import { useAccountOrders, useGroupedByStatusOrders } from "../../../hooks/order-hooks";
import { useCancelOrder } from "../../../hooks/send-transactions-hooks";
import { SwapStatus } from "@orbs-network/swap-ui";

export enum OrdersFilter {
  All = "all",
  Open = "open",
  Canceled = "canceled",
  Completed = "completed",
  Expired = "expired",
}

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
  setStatus: (status: OrdersFilter) => void;
  status: OrdersFilter;
  cancelOrder: (orderId: number) => Promise<string>;
  cancelOrderTxHash: string | undefined;
  cancelOrderStatus?: SwapStatus;
}

export const useSelectedOrder = () => {
  const orders = useAccountOrders().data;

  const { selectedOrderId } = useOrderHistoryContext();

  return useMemo(() => {
    if (!orders || selectedOrderId === undefined) return;
    return orders.find((it) => it.id === selectedOrderId);
  }, [orders, selectedOrderId]);
};
export const OrderHistoryContext = createContext({} as OrderHistoryContextType);

export const OrderHistoryContextProvider = ({ children }: { children: ReactNode }) => {
  const groupedOrders = useGroupedByStatusOrders();
  const [status, setStatus] = useState<OrdersFilter>(OrdersFilter.All);
  const { isLoading } = useAccountOrders();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | undefined>(undefined);
  const selectedOrders = groupedOrders[status] || [];
  const { mutateAsync: cancelOrder, swapStatus: cancelOrderStatus, txHash: cancelOrderTxHash, resetSwapStatus: resetCancelOrderStatus } = useCancelOrder();

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSelectedOrderId(undefined);
        setStatus(OrdersFilter.All);
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

  const onClose = useCallback(() => {
    if (cancelOrderStatus) {
      resetCancelOrderStatus();
    } else {
      setIsOpen(false);
    }
  }, [cancelOrderStatus, resetCancelOrderStatus]);
  const onOpen = useCallback(() => setIsOpen(true), []);

  return (
    <OrderHistoryContext.Provider
      value={{
        selectedOrderId,
        cancelOrder,
        cancelOrderTxHash,
        cancelOrderStatus,
        selectOrder,
        selectedOrders,
        setStatus,
        closePreview,
        status,
        isLoading,
        isOpen,
        onClose,
        onOpen,
      }}
    >
      {children}
    </OrderHistoryContext.Provider>
  );
};

export const useOrderHistoryContext = () => {
  return useContext(OrderHistoryContext);
};
