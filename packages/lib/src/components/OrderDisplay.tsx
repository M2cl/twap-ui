import { styled } from "styled-components";
import React, { ReactNode, useMemo } from "react";
import { StyledColumnFlex, StyledRowFlex, StyledText } from "../styles";
import moment from "moment";
import { makeElipsisAddress } from "../utils";
import { Token } from "../types";
import * as SwapUI from "@orbs-network/swap-ui";
import { useFormatNumber } from "../hooks/useFormatNumber";
import { Label } from "./base/Label";
import { fillDelayText } from "@orbs-network/twap-sdk";
import { useTwapContext } from "../context";
import { useNetwork } from "../hooks/logic-hooks";

const Expiry = ({ deadline }: { deadline?: number }) => {
  const t = useTwapContext()?.translations;
  const res = useMemo(() => moment(deadline).format("DD/MM/YYYY HH:mm"), [deadline]);

  return (
    <DetailRow title={t.expiration} tooltip={t.confirmationDeadlineTooltip}>
      {res}
    </DetailRow>
  );
};

const ChunkSize = ({ srcChunkAmount, srcToken, chunks }: { srcChunkAmount?: string; srcToken?: Token; chunks: number }) => {
  const translations = useTwapContext().translations;

  const _srcChunkAmount = useFormatNumber({ value: srcChunkAmount, decimalScale: 3 });

  if (chunks === 1) return null;

  return (
    <DetailRow title={translations.individualTradeSize} tooltip={translations.confirmationTradeSizeTooltip}>
      {`${srcChunkAmount ? _srcChunkAmount : "-"} ${srcToken?.symbol}`}
    </DetailRow>
  );
};

const MinDestAmount = ({
  dstToken,
  isMarketOrder,
  dstMinAmountOut,
  totalChunks,
}: {
  dstToken?: Token;
  isMarketOrder?: boolean;
  dstMinAmountOut?: string;
  totalChunks?: number;
}) => {
  const { translations: t } = useTwapContext();
  const formattedValue = useFormatNumber({ value: dstMinAmountOut });

  if (isMarketOrder) return null;

  return (
    <DetailRow title={totalChunks === 1 ? t.minReceived : t.minReceivedPerTrade} tooltip={t.confirmationMinDstAmountTootipLimit}>
      {`${dstMinAmountOut ? formattedValue : "-"} ${dstToken?.symbol}`}
    </DetailRow>
  );
};

const ChunksAmount = ({ chunks }: { chunks?: number }) => {
  const t = useTwapContext().translations;

  if (chunks === 1) return null;

  return (
    <DetailRow title={t.numberOfTrades} tooltip={t.confirmationTotalTradesTooltip}>
      {chunks}
    </DetailRow>
  );
};

const Recipient = () => {
  const { translations: t, account } = useTwapContext();
  const explorerUrl = useNetwork()?.explorer;
  const makerAddress = makeElipsisAddress(account);

  return (
    <DetailRow title={t.recipient}>
      {!explorerUrl ? (
        makerAddress
      ) : (
        <a href={`${explorerUrl}/address/${account}`} target="_blank">
          {makerAddress}
        </a>
      )}
    </DetailRow>
  );
};

const TradeInterval = ({ fillDelayMillis, chunks }: { fillDelayMillis?: number; chunks: number }) => {
  const t = useTwapContext()?.translations;
  const text = useMemo(() => fillDelayText(fillDelayMillis), [fillDelayMillis]);

  if (chunks === 1) return null;

  return (
    <DetailRow title={t.tradeInterval} tooltip={t.confirmationtradeIntervalTooltip}>
      {text}
    </DetailRow>
  );
};

const StyledDetails = styled(StyledColumnFlex)({});

const DetailRow = ({
  title,
  tooltip,
  children,
  className = "",
  startLogo,
}: {
  title: ReactNode;
  tooltip?: string;
  children?: React.ReactNode;
  className?: string;
  startLogo?: ReactNode;
}) => {
  return (
    <StyledDetailRow className={`${className} twap-order-display-details-row`}>
      <StyledLabel>
        <Label.Text
          text={
            <>
              {startLogo} {title}
            </>
          }
        />
        {tooltip && <Label.Info text={tooltip} />}
      </StyledLabel>
      <StyledDetailRowChildren className="twap-order-display-details-row-right">{children}</StyledDetailRowChildren>
    </StyledDetailRow>
  );
};

const TxHash = ({ txHash }: { txHash?: string }) => {
  const { translations: t } = useTwapContext();
  const txHashAddress = makeElipsisAddress(txHash);
  const explorerUrl = useNetwork()?.explorer;

  if (!txHash) return null;

  return (
    <DetailRow title={t.txHash}>
      {!explorerUrl ? (
        txHashAddress
      ) : (
        <a href={`${explorerUrl}/tx/${txHash}`} target="_blank">
          {txHashAddress}
        </a>
      )}
    </DetailRow>
  );
};

const Details = ({ className = "", children, onClick }: { className?: string; children?: ReactNode; onClick?: () => void }) => {
  return (
    <StyledDetails onClick={onClick} className={`twap-order-display-details ${className}`}>
      {children}
    </StyledDetails>
  );
};

export function OrderDisplay({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <Container className={`${className} twap-order-display`}>{children}</Container>;
}

const TokenDisplay = ({ amount, token, usd, title, content }: { amount?: string; token?: Token; usd?: string; title?: string; content?: ReactNode }) => {
  const _usd = useFormatNumber({ value: usd, decimalScale: 2 });
  const _amount = useFormatNumber({ value: amount });
  const { uiPreferences } = useTwapContext();
  const usdPrefix = uiPreferences.usd?.prefix || "$";
  const usdSuffix = uiPreferences.usd?.suffix || "";

  const _token = useMemo(() => {
    return {
      symbol: token?.symbol,
      logo: token?.logoUrl,
    };
  }, [token]);

  return (
    <div className="twap-order-display-token">
      <SwapUI.TokenDisplay token={_token} title={title || ""} amount={_amount} usd={!_usd ? "" : `${usdPrefix}${_usd}${usdSuffix}`} />
      {content}
    </div>
  );
};

const SrcToken = ({ amount, token, usd }: { amount?: string; token?: Token; usd?: string }) => {
  const { translations } = useTwapContext();
  return <TokenDisplay amount={amount} token={token} usd={usd} title={translations.from} />;
};

const DstToken = ({
  amount,
  token,
  usd,
  isMarketOrder,
  fillDelayMillis,
  chunks,
}: {
  amount?: string;
  token?: Token;
  usd?: string;
  isMarketOrder?: boolean;
  fillDelayMillis?: number;
  chunks?: number;
}) => {
  const t = useTwapContext().translations;

  const content = useMemo(() => {
    if (!isMarketOrder) return null;
    return (
      <StyledSmallText className="twap-order-display-fill-delay">
        Every {fillDelayText(fillDelayMillis).toLowerCase()} Over {chunks} Orders
      </StyledSmallText>
    );
  }, [chunks, isMarketOrder, fillDelayMillis, t]);

  return <TokenDisplay content={content} amount={!isMarketOrder ? amount : ""} token={token} usd={!isMarketOrder ? usd : ""} title={t.to} />;
};

const StyledSmallText = styled(StyledText)({
  fontSize: 14,
});

const TokensContainer = ({ className = "", children }: { className?: string; children?: ReactNode }) => {
  return <StyledTokens className={`twap-order-display-tokens ${className}`}>{children}</StyledTokens>;
};

OrderDisplay.DetailsContainer = Details;
OrderDisplay.Tokens = TokensContainer;
OrderDisplay.SrcToken = SrcToken;
OrderDisplay.DstToken = DstToken;
OrderDisplay.Expiry = Expiry;
OrderDisplay.ChunkSize = ChunkSize;
OrderDisplay.MinDestAmount = MinDestAmount;
OrderDisplay.ChunksAmount = ChunksAmount;
OrderDisplay.Recipient = Recipient;
OrderDisplay.TradeInterval = TradeInterval;
OrderDisplay.DetailRow = DetailRow;
OrderDisplay.TxHash = TxHash;

const StyledLabel = styled(Label)({
  ".twap-label-text": {
    fontSize: 14,
  },
});

const StyledTokens = styled(StyledColumnFlex)({
  gap: 24,
});

const Container = styled(StyledColumnFlex)({
  gap: 0,
  ".twap-order-display-details": {
    gap: 8,
  },
});

const StyledDetailRow = styled(StyledRowFlex)({
  flexWrap: "wrap",
  justifyContent: "space-between",
});
const StyledDetailRowChildren = styled(StyledRowFlex)({
  width: "auto",
  justifyContent: "flex-end",
  marginLeft: "auto",
  fontSize: 14,
  "*": {
    fontSize: "inherit",
  },
  a: {
    color: "inherit",
    textDecoration: "unset",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});
