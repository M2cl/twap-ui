import { amountUi, TimeUnit } from "@orbs-network/twap-sdk";
import { useCallback, useMemo, useState } from "react";
import { useTwapContext } from "../context";
import {
  useAmountUi,
  useBalanceError,
  useChunks,
  useDestTokenAmount,
  useError,
  useFillDelay,
  useLimitPrice,
  useMinChunkSizeUsd,
  useOnOpenConfirmationModal,
  useOnSrcInputPercentClick,
  useOrderDuration,
  usePriceDiffFromMarketPercent,
  useShouldOnlyWrap,
  useShouldUnwrap,
  useShouldWrapOrUnwrapOnly,
  useSrcChunkAmountUSD,
  useSrcTokenChunkAmount,
  useSwitchChain,
  useUsdAmount,
} from "./logic-hooks";
import BN from "bignumber.js";
import { useFormatNumber } from "./useFormatNumber";
import { useSubmitOrderCallback, useUnwrapToken, useWrapOnly } from "./send-transactions-hooks";
import { SwapStatus } from "@orbs-network/swap-ui";
import { useAccountOrders, useGroupedByStatusOrders } from "./order-hooks";

const defaultPercent = [1, 5, 10];

const useDerivedLimitPrice = () => {
  const {
    state: { typedPrice, isInvertedPrice },
  } = useTwapContext();
  const { amountUI: limitPriceUI } = useLimitPrice();

  return useMemo(() => {
    if (typedPrice !== undefined) return typedPrice;
    if (isInvertedPrice && limitPriceUI) {
      return BN(1).div(limitPriceUI).decimalPlaces(6).toString();
    }

    return !limitPriceUI ? "" : BN(limitPriceUI).decimalPlaces(6).toString();
  }, [typedPrice, limitPriceUI, isInvertedPrice]);
};
const useLimitPriceLoading = () => {
  const { srcToken, dstToken, marketPrice } = useTwapContext();
  return Boolean(srcToken && dstToken && BN(marketPrice || 0).isZero());
};

export const useLimitPriceTokenSelect = () => {
  const {
    state: { isInvertedPrice },
    callbacks,
  } = useTwapContext();

  const bottomTokenSelect = useCallback(
    (token: any) => {
      if (isInvertedPrice) {
        callbacks.onSrcTokenSelect?.(token);
      } else {
        callbacks.onDstTokenSelect?.(token);
      }
    },
    [isInvertedPrice, callbacks.onDstTokenSelect, callbacks.onSrcTokenSelect],
  );

  const topTokenSelect = useCallback(
    (token: any) => {
      if (isInvertedPrice) {
        callbacks.onDstTokenSelect?.(token);
      } else {
        callbacks.onSrcTokenSelect?.(token);
      }
    },
    [isInvertedPrice, callbacks.onDstTokenSelect, callbacks.onSrcTokenSelect],
  );

  return {
    bottomTokenSelect,
    topTokenSelect,
  };
};

export const useLimitPriceInput = () => {
  const { onChange: onLimitPriceChange } = useLimitPrice();
  const { updateState } = useTwapContext();

  const onChange = useCallback(
    (value: string) => {
      onLimitPriceChange(value);
      updateState({ selectedPricePercent: undefined });
    },
    [onLimitPriceChange, updateState],
  );

  return {
    value: useDerivedLimitPrice(),
    onChange,
    isLoading: useLimitPriceLoading(),
  };
};

export const useLimitPricePercentSelect = () => {
  const {
    dstToken,
    marketPrice,
    state: { isInvertedPrice, selectedPricePercent },
    updateState,
  } = useTwapContext();
  const isLoading = useLimitPriceLoading();
  const { onChange: onPriceChange, amountUI: limitPrice } = useLimitPrice();
  const priceDiffFromMarket = usePriceDiffFromMarketPercent();

  const onPercent = useCallback(
    (percent?: string) => {
      if (isLoading) return;
      updateState({ selectedPricePercent: percent });

      if (!percent || BN(percent).isZero()) {
        onPriceChange(undefined);
        return;
      }

      const multiplier = BN(percent).div(100).plus(1);
      let basePrice = amountUi(dstToken?.decimals, marketPrice);

      if (isInvertedPrice && basePrice) {
        basePrice = BN(1).div(basePrice).toString();
      }

      const computedPrice = BN(basePrice || 0)
        .times(multiplier)
        .decimalPlaces(6)
        .toString();
      onPriceChange(computedPrice);
    },
    [updateState, dstToken, marketPrice, isInvertedPrice, onPriceChange, isLoading],
  );

  const options = useMemo(() => {
    if (isInvertedPrice) {
      return defaultPercent.map((it) => -it).map((it) => it.toString());
    } else {
      return defaultPercent.map((it) => it.toString());
    }
  }, [isInvertedPrice]);

  const { buttons, isReset } = useMemo(() => {
    const isSelected = (percent: number) => (BN(limitPrice || 0).isZero() ? false : BN(selectedPricePercent || 0).eq(percent));
    const isReset = !BN(priceDiffFromMarket).isZero() && !options.includes(priceDiffFromMarket) && !selectedPricePercent;

    const resetButton = {
      text: isReset ? `${priceDiffFromMarket}%` : "0%",
      selected: isReset || !selectedPricePercent ? true : false,
      onClick: () => onPercent("0"),
      isReset,
    };
    const buttons = options.map((option) => {
      return {
        text: `${BN(option || 0).isZero() ? "" : isInvertedPrice ? "-" : !isInvertedPrice && "+"} ${Math.abs(Number(option))} %`,
        selected: isSelected(Number(option)),
        onClick: () => onPercent(option),
        isReset: false,
      };
    });

    return {
      buttons: [resetButton, ...buttons],
      isReset,
    };
  }, [options, onPercent, limitPrice, selectedPricePercent, isInvertedPrice, priceDiffFromMarket]);

  return {
    onPercent,
    buttons,
    selected: selectedPricePercent,
    isReset,
  };
};

export const useLimitPriceOnInvert = () => {
  const {
    state: { isInvertedPrice },
    updateState,
  } = useTwapContext();
  return useCallback(() => {
    updateState({
      isInvertedPrice: !isInvertedPrice,
      typedPrice: undefined,
      selectedPricePercent: undefined,
    });
  }, [updateState, isInvertedPrice]);
};

export const useLimitPriceTokens = () => {
  const {
    srcToken,
    dstToken,
    state: { isInvertedPrice },
  } = useTwapContext();

  return {
    topToken: isInvertedPrice ? dstToken : srcToken,
    bottomToken: isInvertedPrice ? srcToken : dstToken,
  };
};

export const useLimitPriceError = () => {
  const { error } = useLimitPrice();
  return error;
};

export const useLimitPanelUsd = () => {
  const {
    state: { isInvertedPrice },
    srcUsd1Token,
    dstUsd1Token,
  } = useTwapContext();
  const { value: limitPrice } = useLimitPriceInput();

  return useUsdAmount(limitPrice, isInvertedPrice ? srcUsd1Token : dstUsd1Token);
};

export const useLimitPricePanel = () => {
  const tokens = useLimitPriceTokens();
  const error = useLimitPriceError();
  const input = useLimitPriceInput();
  const percent = useLimitPricePercentSelect();
  const onInvert = useLimitPriceOnInvert();
  const tokenSelect = useLimitPriceTokenSelect();
  const {
    state: { isInvertedPrice },
  } = useTwapContext();

  const usd = useLimitPanelUsd();

  return {
    tokens,
    error,
    input,
    percent,
    onInvert,
    isInverted: isInvertedPrice,
    tokenSelect,
    usd,
  };
};

export const useTokenBalance = ({ isSrcToken }: { isSrcToken: boolean }) => {
  const { srcBalance, dstBalance } = useTwapContext();
  const token = useToken({ isSrcToken });
  return useAmountUi(token?.decimals, isSrcToken ? srcBalance : dstBalance);
};

export const useTokenUSD = ({ isSrcToken }: { isSrcToken: boolean }) => {
  const {
    srcUsd1Token,
    dstUsd1Token,
    state: { typedSrcAmount },
  } = useTwapContext();
  const dstAmountOut = useDestTokenAmount().amountUI;
  const srcUsd = useUsdAmount(typedSrcAmount, srcUsd1Token);
  const dstUsd = useUsdAmount(dstAmountOut, dstUsd1Token);

  const token = useToken({ isSrcToken });
  const isWrapOrUnwrapOnly = useShouldWrapOrUnwrapOnly();
  const data = isSrcToken ? srcUsd : isWrapOrUnwrapOnly ? srcUsd : dstUsd;

  return {
    data: isSrcToken ? srcUsd : isWrapOrUnwrapOnly ? srcUsd : dstUsd,
    isLoading: Boolean(token && !data),
  };
};

export const useTokenSelect = ({ isSrcToken }: { isSrcToken: boolean }) => {
  const { callbacks } = useTwapContext();
  return useCallback(
    (token: any) => {
      isSrcToken ? callbacks.onSrcTokenSelect?.(token) : callbacks.onDstTokenSelect?.(token);
    },
    [isSrcToken, callbacks.onSrcTokenSelect, callbacks.onDstTokenSelect],
  );
};

export const useToken = ({ isSrcToken }: { isSrcToken: boolean }) => {
  const { srcToken, dstToken } = useTwapContext();
  return isSrcToken ? srcToken : dstToken;
};

export const useTokenInput = ({ isSrcToken }: { isSrcToken: boolean }) => {
  const {
    state: { typedSrcAmount = "" },
    updateState,
  } = useTwapContext();
  const destTokenAmountUI = useDestTokenAmount().amountUI;
  const isWrapOrUnwrapOnly = useShouldWrapOrUnwrapOnly();

  const onChange = useCallback(
    (value: string) => {
      if (!isSrcToken) return;
      updateState({ typedSrcAmount: value });
    },
    [updateState, isSrcToken],
  );
  return {
    value: isWrapOrUnwrapOnly || isSrcToken ? typedSrcAmount : destTokenAmountUI,
    onChange,
  };
};

export const useTokenPanel = ({ isSrcToken }: { isSrcToken: boolean }) => {
  const { value, onChange } = useTokenInput({ isSrcToken });
  const token = useToken({ isSrcToken });
  const otherToken = useToken({ isSrcToken: !isSrcToken });

  const balanceError = useBalanceError();
  const balance = useTokenBalance({ isSrcToken });
  const usd = useTokenUSD({ isSrcToken });
  const onTokenSelect = useTokenSelect({ isSrcToken });
  const onSrcInputPercentClick = useOnSrcInputPercentClick();
  const {
    marketPriceLoading,
    translations: t,
    callbacks: { onMaxSrcAmount },
  } = useTwapContext();

  const onPercent = useCallback(
    (percent: number) => {
      if (!isSrcToken) return;
      onSrcInputPercentClick(percent);
    },
    [onSrcInputPercentClick, isSrcToken],
  );

  const onMax = useCallback(() => {
    if (onMaxSrcAmount) {
      onMaxSrcAmount();
    } else {
      onPercent(1);
    }
  }, [onPercent, onMaxSrcAmount]);

  return {
    value,
    onChange,
    token,
    otherToken,
    error: isSrcToken ? balanceError : false,
    balance,
    usd,
    onTokenSelect,
    onPercent,
    onMax,
    isLoading: isSrcToken ? false : marketPriceLoading,
    title: isSrcToken ? t.from : t.to,
  };
};

export const useSwitchTokensCallback = () => {
  return useTwapContext().callbacks.onSwitchTokens;
};

export const useTradesAmountPanel = () => {
  const { translations: t } = useTwapContext();
  const { setChunks, chunks, error } = useChunks();

  return {
    error,
    trades: chunks,
    onChange: setChunks,
    label: t.tradesAmountTitle,
    tooltip: t.totalTradesTooltip,
  };
};

export const usePriceDisplay = (type: "limit" | "market") => {
  const [inverted, setInverted] = useState(false);
  const { marketPrice, dstToken, srcToken } = useTwapContext();
  const limitPriceUI = useLimitPrice().amountUI;
  const marketPriceUI = useAmountUi(dstToken?.decimals, marketPrice);

  const onInvert = useCallback(() => {
    setInverted(!inverted);
  }, [inverted]);

  const price = useMemo(() => {
    const price = type === "limit" ? limitPriceUI : marketPriceUI;

    if (inverted) return BN(1).div(price).toString();
    return price;
  }, [inverted, limitPriceUI, marketPriceUI]);

  return {
    onInvert,
    price,
    leftToken: !inverted ? srcToken : dstToken,
    rightToken: !inverted ? dstToken : srcToken,
  };
};

export const useChunkSizeMessage = () => {
  const { srcUsd1Token, srcToken } = useTwapContext();
  const srcTokenChunkAmountUI = useSrcTokenChunkAmount().amountUI;
  const srcChunkAmountUsd = useSrcChunkAmountUSD();
  const usd = useFormatNumber({ value: srcChunkAmountUsd, decimalScale: 2 });
  const chunkSizeF = useFormatNumber({ value: srcTokenChunkAmountUI });
  const usdF = usd ? `($${usd})` : "";

  if (!srcUsd1Token || !srcToken) return null;

  return `${chunkSizeF} ${srcToken?.symbol} per trade ${usdF}`;
};

export const usePriceToggle = () => {
  const {
    state: { isMarketOrder },
    updateState,
  } = useTwapContext();

  const setIsMarketOrder = useCallback(
    (value: boolean) => {
      updateState({ isMarketOrder: value });
    },
    [updateState],
  );

  return {
    isMarketOrder,
    setIsMarketOrder,
  };
};

export const useShowConfirmationModalButton = () => {
  const {
    isWrongChain,
    srcUsd1Token,
    account: maker,
    translations: t,
    callbacks,
    marketPrice,
    state: { swapStatus, typedSrcAmount },
    marketPriceLoading,
    srcBalance,
    srcToken,
    dstToken,
  } = useTwapContext();
  const error = useError();
  const minChunkSizeUsd = useMinChunkSizeUsd();

  const onOpen = useOnOpenConfirmationModal();
  const { onConnect } = callbacks;
  const switchChain = useSwitchChain();
  const shouldUnwrap = useShouldUnwrap();
  const shouldOnlyWrap = useShouldOnlyWrap();
  const { mutate: wrap, isLoading: wrapLoading } = useWrapOnly();
  const { mutate: unwrap, isLoading: unwrapLoading } = useUnwrapToken();
  const zeroSrcAmount = BN(typedSrcAmount || "0").isZero();
  const zeroMarketPrice = !BN(marketPrice || 0).gt(0);
  const isPropsLoading = marketPriceLoading || BN(srcUsd1Token || "0").isZero() || srcBalance === undefined || !minChunkSizeUsd;
  const isButtonLoading = !srcToken || !dstToken || !typedSrcAmount ? false : isPropsLoading;

  const noLiquidity = useMemo(() => {
    const result = srcToken && dstToken && !isButtonLoading && !marketPriceLoading && zeroMarketPrice;
    if (!result) return;
    return {
      text: t.noLiquidity,
      disabled: true,
      loading: false,
      onClick: () => {},
    };
  }, [t, isButtonLoading, marketPriceLoading, zeroMarketPrice, srcToken, dstToken]);

  const connect = useMemo(() => {
    if (maker) return;

    return {
      text: t.connect,
      disabled: false,
      loading: false,
      onClick: () => {
        if (onConnect) {
          onConnect();
        }
      },
    };
  }, [maker, onConnect, t]);

  const invalidChain = useMemo(() => {
    if (!isWrongChain) return;
    return {
      text: t.switchNetwork,
      onClick: switchChain,
      disabled: false,
      loading: false,
    };
  }, [isWrongChain, t, switchChain]);

  const wrapOnly = useMemo(() => {
    if (!shouldOnlyWrap) return;

    return {
      text: error || t.wrap,
      onClick: wrap,
      disabled: error || wrapLoading,
      loading: wrapLoading,
    };
  }, [shouldOnlyWrap, wrap, wrapLoading, t, error]);

  const unwrapOnly = useMemo(() => {
    if (!shouldUnwrap) return;

    return {
      text: error || t.unwrap,
      onClick: unwrap,
      disabled: error || unwrapLoading,
      loading: unwrapLoading,
    };
  }, [shouldUnwrap, unwrap, error, unwrapLoading, t]);

  const swap = useMemo(() => {
    return {
      text:
        !srcToken || !dstToken
          ? t.placeOrder
          : !typedSrcAmount
            ? t.enterAmount
            : marketPriceLoading
              ? t.outAmountLoading
              : isButtonLoading
                ? t.placeOrder
                : error
                  ? error
                  : t.placeOrder,
      onClick: onOpen,
      loading: isButtonLoading,
      disabled: swapStatus === SwapStatus.LOADING ? false : zeroMarketPrice || isButtonLoading || error,
    };
  }, [marketPriceLoading, zeroSrcAmount, t, onOpen, swapStatus, isButtonLoading, zeroMarketPrice, error, srcToken, dstToken, typedSrcAmount]);

  return connect || invalidChain || wrapOnly || unwrapOnly || noLiquidity || swap;
};

export const useFillDelayPanel = () => {
  const { setFillDelay, fillDelay, milliseconds, error } = useFillDelay();

  const onInputChange = useCallback(
    (value: string) => {
      setFillDelay({ unit: fillDelay.unit, value: Number(value) });
    },
    [setFillDelay, fillDelay],
  );

  const onUnitSelect = useCallback(
    (unit: TimeUnit) => {
      setFillDelay({ unit, value: fillDelay.value });
    },
    [setFillDelay, fillDelay],
  );

  return {
    onInputChange,
    onUnitSelect,
    setFillDelay,
    milliseconds,
    fillDelay,
    error,
  };
};

export const useOrderDurationPanel = () => {
  const { orderDuration, setOrderDuration, milliseconds } = useOrderDuration();

  const onUnitSelect = useCallback((unit: TimeUnit) => setOrderDuration({ unit, value: orderDuration.value }), [setOrderDuration, orderDuration.value]);

  return {
    orderDuration,
    setOrderDuration,
    milliseconds,
    onUnitSelect,
  };
};

export const useConfirmationModalButton = () => {
  const { mutate: onSubmit, isLoading: mutationLoading } = useSubmitOrderCallback();
  const {
    state: { swapStatus, disclaimerAccepted },
    translations: t,
  } = useTwapContext();

  return useMemo(() => {
    const isLoading = mutationLoading || swapStatus === SwapStatus.LOADING;
    return {
      text: t.confirmOrder,
      onSubmit,
      isLoading,
      disabled: !disclaimerAccepted || isLoading,
    };
  }, [t, onSubmit, disclaimerAccepted, mutationLoading, swapStatus]);
};

export const useFee = () => {
  const {
    fee,
    state: { isMarketOrder },
  } = useTwapContext();
  const destTokenAmount = useDestTokenAmount().amountUI;

  const amountUI = useMemo(() => {
    if (!fee || !destTokenAmount || isMarketOrder) return "";
    return BN(destTokenAmount).multipliedBy(fee).dividedBy(100).toFixed().toString();
  }, [fee, destTokenAmount, isMarketOrder]);
  return {
    amountUI,
    percent: fee,
  };
};

export const useLimitPriceMessage = () => {
  const {
    translations: t,
    state: { isMarketOrder },
  } = useTwapContext();
  const hide = useShouldWrapOrUnwrapOnly();

  return useMemo(() => {
    if (isMarketOrder || hide) return null;

    return {
      text: t.limitPriceMessage,
      url: "https://www.orbs.com/dtwap-and-dlimit-faq/",
    };
  }, [t, isMarketOrder, hide]);
};

export const useOrders = () => {
  const { data: orders } = useAccountOrders();
  const groupedOrders = useGroupedByStatusOrders();

  return {
    orders,
    groupedOrders,
  };
};
