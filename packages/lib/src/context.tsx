import { createContext, useContext, useEffect } from "react";
import { OrderLibProps, TwapLibProps } from "./types";
import { useInitLib } from "./hooks";
import defaultTranlations from "./i18n/en.json";

const TwapContext = createContext<TwapLibProps>({} as TwapLibProps);
const OrdersContext = createContext<OrderLibProps>({} as OrderLibProps);

export const TwapAdapter = (props: TwapLibProps) => {
  const initLib = useInitLib();
  const translations = { ...defaultTranlations, ...props.translations };

  // init web3 every time the provider changes
  useEffect(() => {
    initLib({ config: props.config, provider: props.provider, account: props.account, connectedChainId: props.connectedChainId });
  }, [props.provider, props.config, props.account, props.connectedChainId]);

  return <TwapContext.Provider value={{ ...props, translations }}>{props.children}</TwapContext.Provider>;
};

export const OrdersAdapter = (props: OrderLibProps) => {
  const translations = { ...defaultTranlations, ...props.translations };

  return <OrdersContext.Provider value={{ ...props, translations }}>{props.children}</OrdersContext.Provider>;
};

export const useTwapContext = () => {
  return useContext(TwapContext);
};

export const useOrdersContext = () => {
  return useContext(OrdersContext);
};
