import { useCallback } from "react";
import { useWidgetContext } from "..";
import { useSubmitOrderFlow } from "./useSubmitOrderFlow";
import { useUsdAmount } from "./useUsdAmounts";
import { SwapStatus } from "@orbs-network/swap-ui";

export const useConfirmationModal = () => {
  const {
    state: { showConfirmation: isOpen, swapData, swapStatus, swapError, typedSrcAmount, swapStep, swapSteps },
    srcToken,
    dstToken,
    twap: {
      derivedState: { ui },
    },
    marketPrice,
  } = useWidgetContext();

  const { reset, state, updateState, actions } = useWidgetContext();
  const { mutate: onSubmitOrder } = useSubmitOrderFlow();
  const { dstUsd, srcUsd } = useUsdAmount();
  const { onSwitchFromNativeToWrapped } = actions;

  const onClose = useCallback(() => {
    const success = state.swapStatus === SwapStatus.SUCCESS;
    const failure = state.swapStatus === SwapStatus.FAILED;
    updateState({ showConfirmation: false });
    if (success) {
      setTimeout(() => {
        reset();
      }, 500);
    }

    if (failure) {
      updateState({ swapStatus: undefined, swapStep: undefined });
    }
    if ((success || failure) && state.isWrapped) {
      onSwitchFromNativeToWrapped?.();
    }
  }, [swapStatus, reset, state, updateState, onSwitchFromNativeToWrapped, actions]);

  const onOpen = useCallback(() => {
    updateState({
      showConfirmation: true,
      // prevent data to change during order creation
      swapData: {
        srcAmount: typedSrcAmount,
        outAmount: ui.destTokenAmount || "",
        srcAmountusd: srcUsd,
        outAmountusd: dstUsd,
        marketPrice,
      },
    });
  }, [updateState, ui.destTokenAmount, dstUsd, typedSrcAmount, srcUsd, marketPrice]);

  return {
    onClose,
    onOpen,
    isOpen,
    onSubmitOrder,
    swapData,
    swapStatus,
    swapError,
    swapStep,
    srcToken,
    dstToken,
    swapSteps,
  };
};
