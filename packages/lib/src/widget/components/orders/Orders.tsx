import React, { ReactNode } from "react";
import { styled } from "styled-components";
import { HistoryOrderPreview } from "./HistoryOrderPreview";
import { OrderHistoryContextProvider, useOrderHistoryContext } from "./context";
import { OrderHistoryList } from "./OrderHistoryList";
import { FaArrowRight } from "@react-icons/all-files/fa/FaArrowRight";
import { useMemo } from "react";
import { Spinner } from "../../../components/base";
import { StyledColumnFlex, StyledRowFlex } from "../../../styles";
import { useTwapContext } from "../../../context";
import { useGroupedByStatusOrders } from "../../../hooks/order-hooks";

export const Orders = ({ className = "" }: { className?: string }) => {
  return (
    <OrderHistoryContextProvider>
      <OrderHistory />
      <OrdersButton className={className} />
    </OrderHistoryContextProvider>
  );
};

export const OrdersButton = ({ className = "" }: { className?: string }) => {
  const openOrders = useGroupedByStatusOrders().open;
  const { components } = useTwapContext();

  const { onOpen, isLoading } = useOrderHistoryContext();
  const text = useMemo(() => {
    if (isLoading) {
      return "Loading orders";
    }

    return `${openOrders?.length || 0} Open orders`;
  }, [openOrders, isLoading]);

  if (components.OrdersButton) {
    return <components.OrdersButton onClick={onOpen} openOrdersCount={openOrders?.length || 0} />;
  }

  return (
    <StyledOrderHistoryButton className={`twap-order-history-button ${className}`} onClick={onOpen}>
      {isLoading && <Spinner size={20} />}
      <span className="twap-order-history-button-text">{text}</span>
      <FaArrowRight className="twap-order-history-button-icon" />
    </StyledOrderHistoryButton>
  );
};

const CustomModal = ({ children }: { children: ReactNode }) => {
  const OrderHistoryModal = useTwapContext().modals.OrderHistoryModal;
  const { isOpen, onClose } = useOrderHistoryContext();

  return (
    <OrderHistoryModal isOpen={Boolean(isOpen)} onClose={onClose} title="Order history">
      {children}
    </OrderHistoryModal>
  );
};

const OrderHistory = ({ className = "" }: { className?: string }) => {
  const { selectedOrderId } = useOrderHistoryContext();
  return (
    <CustomModal>
      <StyledContainer className={`twap-order-history ${className}`} order={selectedOrderId !== undefined ? 1 : 0}>
        <HistoryOrderPreview />
        <OrderHistoryList />
      </StyledContainer>
    </CustomModal>
  );
};

const StyledOrderHistoryButton = styled(StyledRowFlex)({
  justifyContent: "flex-start",
  ".twap-show-orders-btn-arrow": {
    marginLeft: "auto",
  },
});

const StyledContainer = styled(StyledColumnFlex)<{ order: number }>(({ order }) => {
  return {
    width: "100%",
    position: "relative",
    height: order ? "auto" : "700px",
    maxHeight: "90vh",
  };
});
