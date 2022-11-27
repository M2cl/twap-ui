import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Config, OrderInputValidation, TokenData, TokensValidation, TWAPLib } from "@orbs-network/twap";
import { TwapContext } from "./context";
import Web3 from "web3";
import { useContext, useMemo, useState } from "react";
import {
  allTokensListAtom,
  balanceGet,
  confirmationAtom,
  createOrderLoadingAtom,
  customFillDelayEnabledAtom,
  deadlineGet,
  deadlineUiGet,
  disclaimerAcceptedAtom,
  dstAmountUiGet,
  dstBalanceUiGet,
  dstMinAmountOutGet,
  dstMinAmountOutUiGet,
  dstTokenAtom,
  dstUsdUiGet,
  fillDelayAtom,
  fillDelayMillisGet,
  gasPriceGet,
  isLimitOrderAtom,
  limitPriceGet,
  limitPriceUiAtom,
  marketPriceGet,
  maxDurationAtom,
  maxPossibleChunksGet,
  orderHistoryGet,
  OrderUI,
  refetchAllowanceSet,
  resetAllQueriesSet,
  resetAllSet,
  shouldUnwrapGet,
  shouldWrapNativeGet,
  srcAmountGet,
  srcAmountPercentSet,
  srcAmountUiAtom,
  srcBalanceUiGet,
  srcChunkAmountGet,
  srcChunkAmountUiGet,
  srcChunkAmountUsdUiGet,
  srcTokenAtom,
  srcUsdUiGet,
  switchTokensSet,
  tokenAllowanceGet,
  totalChunksAtom,
  twapLibAtom,
  usdGet,
} from "./state";
import BN from "bignumber.js";
import moment from "moment";
import { Translations } from "./types";
import _ from "lodash";
import { useSendAnalyticsEvents } from "./analytics";
import { zeroAddress } from "@defi.org/web3-candies";
import { queryClientAtom } from "jotai-tanstack-query";

const useWrapToken = () => {
  const lib = useAtomValue(twapLibAtom);
  const srcAmount = useAtomValue(srcAmountGet);
  const srcToken = useAtomValue(srcTokenAtom);
  const dstToken = useAtomValue(dstTokenAtom);

  const { priorityFeePerGas, maxFeePerGas } = useGasPrice();

  const setSrcToken = useSetAtom(srcTokenAtom);
  const analytics = useSendAnalyticsEvents();
  const reset = useSetAtom(resetAllSet);

  return useMutation(
    async () => {
      analytics.onWrapClick(srcAmount);
      return lib!.wrapNativeToken(srcAmount, priorityFeePerGas, maxFeePerGas);
    },
    {
      onSuccess: () => {
        analytics.onWrapSuccess();
        if (lib?.validateTokens(srcToken!, dstToken!) === TokensValidation.wrapOnly) {
          reset();
          return;
        }
        setSrcToken(lib!.config.wToken);
      },
      onError: (error: Error) => {
        console.log(error.message);
        analytics.onWrapError(error.message);
      },
    }
  );
};

const useUnwrapToken = () => {
  const srcTokenAmount = useAtomValue(srcAmountGet);
  const lib = useAtomValue(twapLibAtom);
  const { priorityFeePerGas, maxFeePerGas } = useGasPrice();
  const reset = useSetAtom(resetAllSet);

  return useMutation(
    async () => {
      return lib?.unwrapNativeToken(srcTokenAmount, priorityFeePerGas, maxFeePerGas);
    },
    {
      onSuccess: () => {
        reset();
      },
    }
  );
};

const useMutation = <T>(
  method: (args?: any) => Promise<T>,
  callbacks?: { onSuccess?: (data: T, args?: any) => void; onError?: (error: Error) => void; onFinally?: () => void }
) => {
  const [data, setData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const lib = useAtomValue(twapLibAtom);

  const mutate = async (args?: any) => {
    try {
      setIsLoading(true);
      const result = await lib!.waitForConfirmation(() => method(args));
      setData(result);
      callbacks?.onSuccess?.(result, args);
    } catch (error) {
      callbacks?.onError?.(error as Error);
    } finally {
      setIsLoading(false);
      callbacks?.onFinally?.();
    }
  };

  return { isLoading, mutate, data };
};

const useGasPrice = () => {
  const gasPriceFromDapp = useContext(TwapContext).gasPrice;
  return useAtomValue(gasPriceGet(gasPriceFromDapp));
};

const useApproveToken = () => {
  const lib = useAtomValue(twapLibAtom);
  const srcAmount = useAtomValue(srcAmountGet).integerValue(BN.ROUND_FLOOR);
  const { priorityFeePerGas, maxFeePerGas } = useGasPrice();

  const srcToken = useAtomValue(srcTokenAtom);
  const refetchAllowance = useSetAtom(refetchAllowanceSet);
  const analytics = useSendAnalyticsEvents();
  const client = useAtomValue(queryClientAtom);

  return useMutation(
    async () => {
      analytics.onApproveClick(srcAmount);

      await lib?.approve(srcToken!, srcAmount, priorityFeePerGas, maxFeePerGas);
      await client.refetchQueries();
    },
    {
      onSuccess: () => {
        refetchAllowance();
        analytics.onApproveSuccess();
      },
      onError: (error: Error) => {
        analytics.onApproveError(error.message);
      },
    }
  );
};

export const useCreateOrder = () => {
  const lib = useAtomValue(twapLibAtom);
  const srcToken = useAtomValue(srcTokenAtom)!;
  const dstToken = useAtomValue(dstTokenAtom)!;
  const srcAmount = useAtomValue(srcAmountGet);
  const srcChunkAmount = useAtomValue(srcChunkAmountGet);
  const dstMinChunkAmountOut = useAtomValue(dstMinAmountOutGet);
  const deadline = useAtomValue(deadlineGet);
  const fillDelay = useAtomValue(fillDelayAtom);
  const srcUsd = useAtomValue(usdGet(srcToken)).value;
  const setCreateOrderLoading = useSetAtom(createOrderLoadingAtom);
  const { priorityFeePerGas, maxFeePerGas } = useGasPrice();

  const reset = useSetAtom(resetAllSet);
  const analytics = useSendAnalyticsEvents();

  return useMutation(
    async () => {
      console.log({
        srcToken,
        dstToken,
        srcAmount: srcAmount.toString(),
        srcChunkAmount: srcChunkAmount.toString(),
        dstMinChunkAmountOut: dstMinChunkAmountOut.toString(),
        deadline,
        fillDelay,
        srcUsd: srcUsd.toString(),
        priorityFeePerGas: priorityFeePerGas?.toString(),
        maxFeePerGas: maxFeePerGas?.toString(),
      });
      analytics.onConfirmationCreateOrderClick();
      setCreateOrderLoading(true);
      return lib!.submitOrder(
        srcToken,
        { ...dstToken, address: lib?.validateTokens(srcToken, dstToken) === TokensValidation.dstTokenZero ? zeroAddress : dstToken.address },
        srcAmount,
        srcChunkAmount,
        dstMinChunkAmountOut,
        deadline,
        (fillDelay.amount * fillDelay.resolution) / 1000,
        srcUsd,
        priorityFeePerGas,
        maxFeePerGas
      );
    },
    {
      onSuccess: () => {
        analytics.onCreateOrderSuccess();
        reset();
      },
      onError: (error: Error) => {
        analytics.onCreateOrderError(error.message);
        console.log(error);
      },

      onFinally: () => {
        setCreateOrderLoading(false);
      },
    }
  );
};

export const useInitLib = () => {
  const setTwapLib = useSetAtom(twapLibAtom);
  const setTokenList = useSetAtom(allTokensListAtom);

  return (config: Config, provider?: any, account?: any, tokenList?: TokenData[]) => {
    setTokenList(tokenList || []);
    if (provider && account) {
      setTwapLib(new TWAPLib(config, account, provider));
    } else {
      setTwapLib(undefined);
    }
  };
};

const useOrderFillWarning = () => {
  const chunkSize = useAtomValue(srcChunkAmountGet);
  const fillDelay = useAtomValue(fillDelayAtom);
  const maxDuration = useAtomValue(maxDurationAtom);
  const srcToken = useAtomValue(srcTokenAtom);
  const dstToken = useAtomValue(dstTokenAtom);
  const srcUsdValue = useAtomValue(usdGet(srcToken)).value;
  const srcBalance = useAtomValue(balanceGet(srcToken)).value;
  const srcAmount = useAtomValue(srcAmountGet);
  const minAmountOut = useAtomValue(dstMinAmountOutGet);
  const lib = useAtomValue(twapLibAtom);
  const deadline = useAtomValue(deadlineGet);
  const translation = useTwapTranslations();
  const isLimitOrder = useAtomValue(isLimitOrderAtom);
  const limitPrice = useAtomValue(limitPriceGet(false));

  if (!srcToken || !dstToken || lib?.validateTokens(srcToken, dstToken) === TokensValidation.invalid) return translation.selectTokens;
  if (srcAmount.isZero()) return translation.enterAmount;
  if (srcBalance && srcAmount.gt(srcBalance)) return translation.insufficientFunds;
  if (chunkSize.isZero()) return translation.enterTradeSize;
  if (maxDuration.amount === 0) return translation.enterMaxDuration;
  if (isLimitOrder && limitPrice.limitPrice.isZero()) return translation.insertLimitPriceWarning;
  const valuesValidation = lib?.validateOrderInputs(
    srcToken!,
    dstToken!,
    srcAmount,
    chunkSize,
    minAmountOut,
    deadline,
    (fillDelay.amount * fillDelay.resolution) / 1000,
    srcUsdValue
  );

  if (valuesValidation === OrderInputValidation.invalidTokens) {
    return translation.selectTokens;
  }

  if (valuesValidation === OrderInputValidation.invalidSmallestSrcChunkUsd) {
    return translation.tradeSizeMustBeEqual;
  }
};

export const useSwitchTokens = () => {
  const result = useSetAtom(switchTokensSet);
  return result;
};

const useChangeNetwork = () => {
  const translations = useTwapTranslations();
  const lib = useAtomValue(twapLibAtom);
  const reset = useSetAtom(resetAllSet);

  const onChangeNetwork = async () => {
    if (lib) {
      await changeNetwork(new Web3(lib.provider), lib.config.chainId);
      reset();
    }
  };

  return { text: translations.switchNetwork, onClick: onChangeNetwork, loading: false, disabled: false };
};

const useConnect = () => {
  const translations = useTwapTranslations();
  const { connect } = useContext(TwapContext);

  return { text: translations.connect, onClick: connect ? connect : undefined, loading: false, disabled: false };
};

const useIsWrongNetwork = () => {
  const { connectedChainId } = useContext(TwapContext);
  const lib = useAtomValue(twapLibAtom);

  return useMemo(() => (connectedChainId && connectedChainId !== lib?.config.chainId ? true : false), [connectedChainId, lib]);
};

export const useShowConfirmationButton = () => {
  const lib = useAtomValue(twapLibAtom);
  const translations = useTwapTranslations();
  const shouldWrap = useAtomValue(shouldWrapNativeGet);
  const shouldUnwrap = useAtomValue(shouldUnwrapGet);
  const allowance = useAtomValue(tokenAllowanceGet);
  const showConfirmation = useSetAtom(confirmationAtom);
  const connectArgs = useConnect();
  const changeNetworkArgs = useChangeNetwork();
  const { mutate: approve, isLoading: approveLoading } = useApproveToken();
  const warning = useOrderFillWarning();
  const { mutate: wrap, isLoading: wrapLoading } = useWrapToken();
  const { mutate: unwrap, isLoading: unwrapLoading } = useUnwrapToken();
  const createOrderLoading = useAtomValue(createOrderLoadingAtom);

  const wrongNetwork = useIsWrongNetwork();
  if (!lib?.maker) {
    return connectArgs;
  }
  if (wrongNetwork) {
    return changeNetworkArgs;
  }

  if (warning) {
    return { text: warning, onClick: () => {}, disabled: true, loading: false };
  }
  if (shouldUnwrap) {
    return { text: translations.unwrap, onClick: unwrap, loading: unwrapLoading, disabled: unwrapLoading };
  }
  if (shouldWrap) {
    return { text: translations.wrap, onClick: wrap, loading: wrapLoading, disabled: wrapLoading };
  }
  if (allowance.loading) {
    return { text: "", onClick: () => {}, loading: true, disabled: true };
  }
  if (allowance.hasAllowance === false) {
    return { text: translations.approve, onClick: approve, loading: approveLoading, disabled: approveLoading };
  }
  if (createOrderLoading) {
    return { text: "", onClick: () => showConfirmation(true), loading: true, disabled: false };
  }
  return { text: translations.placeOrder, onClick: () => showConfirmation(true), loading: false, disabled: false };
};

export const useOrders = () => {
  const { orders = {}, loading } = useAtomValue(orderHistoryGet);
  return { orders, loading };
};

export const useCreateOrderButton = () => {
  const { mutate: createOrder } = useCreateOrder();
  const disclaimerAccepted = useAtomValue(disclaimerAcceptedAtom);
  const lib = useAtomValue(twapLibAtom);
  const translations = useTwapTranslations();
  const connectArgs = useConnect();
  const changeNetworkArgs = useChangeNetwork();
  const wrongNetwork = useIsWrongNetwork();
  const createOrderLoading = useAtomValue(createOrderLoadingAtom);

  if (!lib?.maker) {
    return connectArgs;
  }
  if (wrongNetwork) {
    return changeNetworkArgs;
  }

  return { text: translations.confirmOrder, onClick: createOrder, loading: createOrderLoading, disabled: !disclaimerAccepted || createOrderLoading };
};

const useSrcTokenPanel = () => {
  const onChange = useSetAtom(srcAmountUiAtom);
  const token = useAtomValue(srcTokenAtom);
  const selectToken = useSetAtom(srcTokenAtom);
  const amount = useAtomValue(srcAmountUiAtom);
  const usdValue = useAtomValue(srcUsdUiGet);
  const balance = useAtomValue(srcBalanceUiGet);
  const usdLoading = useAtomValue(usdGet(useAtomValue(srcTokenAtom))).loading;
  const balanceLoading = useAtomValue(balanceGet(useAtomValue(srcTokenAtom))).loading;
  const analytics = useSendAnalyticsEvents();
  const { onSrcTokenSelected } = useContext(TwapContext);

  const onSelectToken = (token: TokenData) => {
    selectToken(token);
    analytics.onSrcTokenClick(token.symbol);
    onSrcTokenSelected?.(token);
  };

  return {
    onChange,
    token,
    selectToken: onSelectToken,
    amount,
    usdValue,
    balance,
    usdLoading,
    balanceLoading,
  };
};

const useDstTokenPanel = () => {
  const token = useAtomValue(dstTokenAtom);
  const selectToken = useSetAtom(dstTokenAtom);
  const amount = useAtomValue(dstAmountUiGet);
  const usdValue = useAtomValue(dstUsdUiGet);
  const balance = useAtomValue(dstBalanceUiGet);
  const usdLoading = useAtomValue(usdGet(useAtomValue(dstTokenAtom))).loading;
  const balanceLoading = useAtomValue(balanceGet(useAtomValue(dstTokenAtom))).loading;
  const analytics = useSendAnalyticsEvents();
  const { onDstTokenSelected } = useContext(TwapContext);

  const onSelectToken = (token: TokenData) => {
    selectToken(token);
    analytics.onDstTokenClick(token.symbol);
    onDstTokenSelected?.(token);
  };

  return {
    token,
    selectToken: onSelectToken,
    amount,
    usdValue,
    balance,
    onChange: () => {},
    usdLoading,
    balanceLoading,
  };
};

export const useTokenPanel = (isSrc?: boolean) => {
  const srcValues = useSrcTokenPanel();
  const dstValues = useDstTokenPanel();
  const isLimitOrder = useAtomValue(isLimitOrderAtom);
  const { getTokenImage, TokenSelectModal, connectedChainId } = useContext(TwapContext);
  const translations = useTwapTranslations();
  const [tokenListOpen, setTokenListOpen] = useState(false);
  const maker = useMaker();
  const wrongNetwork = useIsWrongNetwork();

  const { selectToken, token, amount, onChange, balance, usdValue, usdLoading, balanceLoading } = isSrc ? srcValues : dstValues;

  const onTokenSelect = (token: TokenData) => {
    if (getTokenImage) {
      token.logoUrl = getTokenImage(token);
    }

    selectToken(token);
    setTokenListOpen(false);
  };

  const selectTokenWarning = useMemo(() => {
    if (!maker) {
      return translations.connect;
    }
    if (wrongNetwork) {
      return translations.switchNetwork;
    }
  }, [maker, translations, wrongNetwork]);

  return {
    address: token?.address,
    symbol: token?.symbol,
    logo: token?.logoUrl,
    value: amount,
    onChange,
    balance,
    disabled: !isSrc || !maker || !token,
    usdValue,
    onTokenSelect,
    tokenListOpen,
    toggleTokenList: (value: boolean) => setTokenListOpen(value),
    amountPrefix: isSrc ? "" : isLimitOrder ? "≥" : "~",
    TokenSelectModal,
    inputWarning: !isSrc ? undefined : !token ? translations.selectTokens : undefined,
    selectTokenWarning,
    connectedChainId,
    usdLoading,
    balanceLoading,
  };
};

export const useMarketPrice = () => {
  const [inverted, setInverted] = useState(false);
  const { leftToken, rightToken, marketPriceUi: marketPrice } = useAtomValue(marketPriceGet(inverted));

  return { leftToken, rightToken, marketPrice, toggleInverted: () => setInverted(!inverted), ready: !!leftToken && !!rightToken };
};

export const useLimitPrice = () => {
  const [inverted, setInverted] = useState(false);
  const translations = useTwapTranslations();
  const [isLimitOrder, setIsLimitOrder] = useAtom(isLimitOrderAtom);
  const setLimitPrice = useSetAtom(limitPriceUiAtom);
  const { limitPriceUi: limitPrice, leftToken, rightToken } = useAtomValue(limitPriceGet(inverted));
  const { marketPrice } = useMarketPrice();
  const analytics = useSendAnalyticsEvents();

  const onChange = (amountUi = "") => {
    setLimitPrice({ price: amountUi, inverted });
  };

  const onToggleLimit = () => {
    setInverted(false);
    setIsLimitOrder(!isLimitOrder);
    onChange(marketPrice);
    analytics.onLimitToggleClick(isLimitOrder ? false : true);
  };

  const toggleInverted = () => {
    setInverted(!inverted);
  };

  return {
    onToggleLimit,
    toggleInverted,
    onChange,
    limitPrice,
    leftToken,
    rightToken,
    warning: !leftToken || !rightToken ? translations.selectTokens : undefined,
    isLimitOrder,
  };
};

export const useOrderOverview = () => {
  const totalChunks = useAtomValue(totalChunksAtom);
  const srcToken = useAtomValue(srcTokenAtom);
  const dstToken = useAtomValue(dstTokenAtom);
  const srcAmount = useAtomValue(srcAmountUiAtom);
  const isLimitOrder = useAtomValue(isLimitOrderAtom);
  const [showConfirmation, setShowConfirmation] = useAtom(confirmationAtom);
  const [disclaimerAccepted, setDisclaimerAccepted] = useAtom(disclaimerAcceptedAtom);
  const deadlineUi = useAtomValue(deadlineUiGet);
  const fillDelayMillis = useAtomValue(fillDelayMillisGet);
  const srcChunkAmount = useAtomValue(srcChunkAmountUiGet);
  const minAmountOut = useAtomValue(dstMinAmountOutUiGet);
  const srcUsd = useAtomValue(srcUsdUiGet);
  const dstUsd = useAtomValue(dstUsdUiGet);
  const dstAmount = useAtomValue(dstAmountUiGet);
  const translations = useTwapTranslations();
  const maker = useMaker();

  const result = {
    srcToken,
    dstToken,
    deadline: deadlineUi,
    fillDelay: fillDelayUi(fillDelayMillis, translations),
    totalChunks,
    srcChunkAmount,
    srcUsd,
    srcAmount,
    dstUsd,
    dstAmount,
    minAmountOut,
    isLimitOrder,
    showConfirmation,
    closeConfirmation: () => setShowConfirmation(false),
    disclaimerAccepted,
    setDisclaimerAccepted,
    maker,
  };

  const isValid = _.every(_.values(result));

  return { ...result, isValid }; // TODO check isValid in components
};

export const useCustomActions = () => {
  const onPercentClick = useSetAtom(srcAmountPercentSet);

  return { onPercentClick };
};

export const useChunks = () => {
  const chunksAmount = useAtomValue(srcChunkAmountUiGet);
  const onTotalChunksChange = useSetAtom(totalChunksAtom);
  const totalChunks = useAtomValue(totalChunksAtom);
  const usdValue = useAtomValue(srcChunkAmountUsdUiGet);
  const token = useAtomValue(srcTokenAtom);
  const maxPossibleChunks = useAtomValue(maxPossibleChunksGet);
  const srcToken = useAtomValue(srcTokenAtom);
  const srcAmountUi = useAtomValue(srcAmountUiAtom);
  const usdLoading = useAtomValue(usdGet(useAtomValue(srcTokenAtom))).loading;

  return {
    chunksAmount,
    onTotalChunksChange,
    totalChunks,
    usdValue,
    token,
    usdLoading,
    maxPossibleChunks,
    ready: !!srcToken && !!srcAmountUi,
  };
};

export const useMaxDuration = () => {
  const [maxDuration, setMaxDuration] = useAtom(maxDurationAtom);

  return {
    maxDuration,
    onChange: setMaxDuration,
  };
};

export const useFillDelay = () => {
  const [fillDelay, setFillDelay] = useAtom(fillDelayAtom);
  const [customFillDelayEnabled, setCustomFillDelayEnabled] = useAtom(customFillDelayEnabledAtom);
  const analytics = useSendAnalyticsEvents();

  const onCustomFillDelayClick = () => {
    setCustomFillDelayEnabled(true);
    analytics.onCustomIntervalClick();
  };

  return {
    fillDelay,
    onCustomFillDelayClick,
    onChange: setFillDelay,
    customFillDelayEnabled,
  };
};

export const useCancelOrder = () => {
  const lib = useAtomValue(twapLibAtom);
  const reset = useSetAtom(resetAllQueriesSet);
  const { priorityFeePerGas, maxFeePerGas } = useGasPrice();

  const analytics = useSendAnalyticsEvents();

  return useMutation(
    async (orderId: number) => {
      analytics.onCancelOrderClick(orderId);
      return lib?.cancelOrder(orderId, priorityFeePerGas, maxFeePerGas);
    },
    {
      onSuccess: (_result, orderId) => {
        analytics.onCancelOrderClick(orderId);
        reset();
      },
      onError: (error: Error) => {
        analytics.onCancelOrderError(error.message);
      },
    }
  );
};

export const useTokenImage = (token?: TokenData) => {
  const { getTokenImage } = useContext(TwapContext);
  return !token ? "" : getTokenImage ? getTokenImage(token) : token.logoUrl;
};

export const useHistoryPrice = (order: OrderUI) => {
  const [inverted, setInverted] = useState(false);

  const srcTokenLogo = useTokenImage(order.ui.srcToken);
  const dstTokenLogo = useTokenImage(order.ui.dstToken);

  const price = inverted ? BN(1).div(order.ui.dstPriceFor1Src) : order.ui.dstPriceFor1Src;

  const srcToken = {
    ...order.ui.srcToken,
    logoUrl: srcTokenLogo,
  };

  const dstToken = {
    ...order.ui.dstToken,
    logoUrl: dstTokenLogo,
  };

  return {
    inverted,
    toggleInverted: () => setInverted(!inverted),
    price,
    priceUi: price.toFormat(),
    leftToken: inverted ? dstToken : srcToken,
    rightToken: !inverted ? dstToken : srcToken,
  };
};

export const fillDelayUi = (value: number, translations: Translations) => {
  if (!value) {
    return "0";
  }
  const time = moment.duration(value);
  const days = time.days();
  const hours = time.hours();
  const minutes = time.minutes();
  const seconds = time.seconds();

  const arr: string[] = [];

  if (days) {
    arr.push(`${days} ${translations.days} `);
  }
  if (hours) {
    arr.push(`${hours} ${translations.hours} `);
  }
  if (minutes) {
    arr.push(`${minutes} ${translations.minutes}`);
  }
  if (seconds) {
    arr.push(`${seconds} ${translations.seconds}`);
  }
  return arr.join(" ");
};

export const useMaker = () => {
  const lib = useAtomValue(twapLibAtom);
  return lib?.maker;
};

export const changeNetwork = async (web3?: Web3, chain?: number) => {
  if (!web3 || !chain) {
    return;
  }

  const provider = web3 ? web3.givenProvider : undefined;
  if (!provider) {
    return;
  }

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: Web3.utils.toHex(chain) }],
    });
  } catch (error: any) {
    // if unknown chain, add chain
    if (error.code === 4902) {
      const response = await fetch("https://chainid.network/chains.json");
      const list = await response.json();
      const chainArgs = list.find((it: any) => it.chainId === chain);
      if (!chainArgs) {
        return;
      }

      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainName: chainArgs.name,
            nativeCurrency: chainArgs.nativeCurrency,
            rpcUrls: chainArgs.rpc,
            chainId: Web3.utils.toHex(chain),
            blockExplorerUrls: [_.get(chainArgs, ["explorers", 0, "url"])],
            iconUrls: [`https://defillama.com/chain-icons/rsz_${chainArgs.chain}.jpg`],
          },
        ],
      });
    }
  }
};

export const useTwapTranslations = () => {
  const { translations } = useContext(TwapContext);
  return translations || ({} as Translations);
};
