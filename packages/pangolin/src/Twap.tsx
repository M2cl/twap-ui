import { GlobalStyles } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Components, hooks, Translations, TwapAdapter, TWAPProps, useTwapContext } from "@orbs-network/twap-ui";
import { AiFillEdit } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { memo, ReactNode, useCallback } from "react";
import translations from "./i18n/en.json";
import {
  globalStyle,
  StyledButton,
  StyledCard,
  StyledChangeOrder,
  StyledColoredFlex,
  StyledColumnGap,
  StyledDstToken,
  StyledFlexBetween,
  StyledFlexStart,
  StyledIcon,
  StyledIntervalTimeSelect,
  StyledLimitPrice,
  StyledMarketPrice,
  StyledNumbericInput,
  StyledOrderConfirmation,
  StyledPanelLabel,
  StyledPercentBtn,
  StyledPrice,
  StyledSlider,
  StyledSliderContainer,
  StyledSrcTokenPercentSelector,
  StyledSwitch,
  StyledTokenDisplay,
  StyledTokenOrder,
  StyledTokenPanel,
  StyledTokenSelect,
  StyledTotalTradesInput,
  StyledTrade,
  StyledTradeInfoModal,
  StyledTradeSize,
  StyledUSD,
} from "./styles";
import { Configs } from "@orbs-network/twap";
import { LocalContext, parseToken, useAdapterContext, useParseTokenList, useTokensFromDapp } from "./hooks";

const TWAP = (props: TWAPProps) => {
  const tokenList = useParseTokenList(props.dappTokens);
  useTokensFromDapp(props.srcToken, props.dstToken, tokenList);

  const memoizedConnect = useCallback(() => {
    props.connect?.();
  }, []);

  return (
    <TwapAdapter
      connect={memoizedConnect}
      config={Configs.Pangolin}
      maxFeePerGas={props.maxFeePerGas}
      priorityFeePerGas={props.priorityFeePerGas}
      translations={translations as Translations}
      provider={props.provider}
      account={props.account}
      connectedChainId={props.connectedChainId}
    >
      <GlobalStyles styles={globalStyle as any} />
      <LocalContext value={{ TokenSelectModal: props.TokenSelectModal }}>
        <div className="twap-container" style={{ flexDirection: "column", width: "100%" }}>
          <SrcTokenPanel />
          <ChangeTokensOrder />
          <DstTokenPanel />
          <LimitPriceDisplay />
          <TradeSize />
          <MaxDuration />
          <TradeInterval />
          <PlaceOrderButton />
          <OrderConfirmation />
          <Components.PoweredBy />
        </div>
      </LocalContext>
    </TwapAdapter>
  );
};

export default memo(TWAP);

const MarketPrice = () => {
  const { toggleInverted, leftToken, rightToken, marketPrice, ready } = hooks.useMarketPrice();
  const translations = useTwapContext().translations;

  return (
    <StyledMarketPrice>
      <StyledCard>
        <StyledFlexBetween>
          <Components.Text className="title">{translations.currentMarketPrice}</Components.Text>
          {ready ? (
            <Components.TokenPriceCompare leftToken={leftToken} rightToken={rightToken} price={marketPrice} toggleInverted={toggleInverted} />
          ) : (
            <Components.Text>-</Components.Text>
          )}
        </StyledFlexBetween>
      </StyledCard>
    </StyledMarketPrice>
  );
};

const SrcTokenPercentSelector = () => {
  const { onPercentClick } = hooks.useCustomActions();

  const onClick = (value: number) => {
    onPercentClick(value);
  };

  return (
    <StyledSrcTokenPercentSelector>
      <StyledPercentBtn onClick={() => onClick(0.25)}>25%</StyledPercentBtn>
      <StyledPercentBtn onClick={() => onClick(0.5)}>50%</StyledPercentBtn>
      <StyledPercentBtn onClick={() => onClick(0.75)}>75%</StyledPercentBtn>
      <StyledPercentBtn onClick={() => onClick(1)}>100%</StyledPercentBtn>
    </StyledSrcTokenPercentSelector>
  );
};

const SrcTokenPanel = () => (
  <TokenPanel isSrcToken={true}>
    <SrcTokenPercentSelector />
  </TokenPanel>
);

const DstTokenPanel = () => (
  <StyledDstToken>
    <TokenPanel isSrcToken={false} />
    <MarketPrice />
  </StyledDstToken>
);

const ChangeTokensOrder = () => {
  const switchTokens = hooks.useSwitchTokens();
  return (
    <StyledChangeOrder>
      <Components.IconButton onClick={switchTokens}>
        <StyledIcon icon={<HiOutlineSwitchVertical />} />
      </Components.IconButton>
    </StyledChangeOrder>
  );
};

const TradeSize = () => {
  const { chunksAmount, onTotalChunksChange, totalChunks, token, maxPossibleChunks, ready } = hooks.useChunks();
  const translations = useTwapContext().translations;

  return (
    <StyledTrade>
      <StyledSliderContainer gap={10}>
        <Components.Label tooltipText={translations.totalTradesTooltip}>{translations.totalTrades}</Components.Label>

        {ready ? (
          <>
            <StyledSlider>
              <Components.Slider maxTrades={maxPossibleChunks} value={totalChunks} onChange={onTotalChunksChange} />
            </StyledSlider>
            <Components.Tooltip text={translations.sliderMinSizeTooltip}>
              <StyledTotalTradesInput
                placeholder="0"
                value={totalChunks}
                decimalScale={0}
                maxValue={maxPossibleChunks.toString()}
                onChange={(value) => onTotalChunksChange(Number(value))}
              />
            </Components.Tooltip>
          </>
        ) : (
          <Components.Text>-</Components.Text>
        )}
      </StyledSliderContainer>
      <StyledTradeSize>
        <Components.Label fontSize={14} tooltipText={translations.tradeSizeTooltip}>
          {translations.tradeSize}: <Components.NumberDisplay value={chunksAmount} />
        </Components.Label>
        {token && <TokenDisplay logo={token?.logoUrl} name={token?.symbol} />}
      </StyledTradeSize>
    </StyledTrade>
  );
};

const LimitPriceDisplay = () => {
  const { isLimitOrder, onToggleLimit, onChange, limitPrice, leftToken, rightToken, toggleInverted, warning } = hooks.useLimitPrice();
  const isLoading = false;
  const translations = useTwapContext().translations;

  return (
    <StyledPrice>
      <StyledColumnGap>
        <StyledFlexStart>
          <Components.Tooltip text={warning}>
            {isLoading ? <Components.Loader width={50} /> : <StyledSwitch disabled={!!warning} value={isLimitOrder} onChange={onToggleLimit} />}
          </Components.Tooltip>
          <Components.Label tooltipText={isLimitOrder ? translations.limitPriceTooltip : translations.marketPriceTooltip}>{translations.limitPrice}</Components.Label>
        </StyledFlexStart>
        {isLimitOrder && (
          <Components.LimitPrice onChange={onChange} toggleInverted={toggleInverted} price={limitPrice} leftToken={leftToken} rightToken={rightToken} placeholder="0" />
        )}
      </StyledColumnGap>
    </StyledPrice>
  );
};

const MaxDuration = () => {
  const { maxDuration, onChange } = hooks.useMaxDuration();
  const translations = useTwapContext().translations;

  return (
    <StyledColoredFlex gap={10}>
      <Components.Label tooltipText={translations.maxDurationTooltip}>{translations.maxDuration}</Components.Label>
      <Components.TimeSelector value={maxDuration} onChange={onChange} />
    </StyledColoredFlex>
  );
};

const TradeInterval = () => {
  const { fillDelay, customFillDelayEnabled, onChange, onCustomFillDelayClick } = hooks.useFillDelay();
  const translations = useTwapContext().translations;

  return (
    <StyledColoredFlex gap={10}>
      <Components.Label tooltipText={translations.tradeIntervalTootlip}>{translations.tradeInterval}</Components.Label>
      <StyledIntervalTimeSelect>
        <Components.TimeSelector disabled={!customFillDelayEnabled} onChange={onChange} value={fillDelay} />
      </StyledIntervalTimeSelect>
      {!customFillDelayEnabled && (
        <Components.IconButton tooltip={translations.customIntervalTooltip} onClick={onCustomFillDelayClick}>
          <StyledIcon icon={<AiFillEdit />} />
        </Components.IconButton>
      )}
    </StyledColoredFlex>
  );
};

const TokenDisplay = ({ logo, name }: { logo?: string; name?: string }) => {
  return (
    <StyledTokenDisplay className="token-display">
      <Components.TokenLogo logo={logo} />
      <Components.TokenName name={name} />
    </StyledTokenDisplay>
  );
};

interface TokenPanelProps {
  children?: ReactNode;
  isSrcToken?: boolean;
}

interface TokenSelectProps {
  isOpen: boolean;
  onClose: () => void;
  onCurrencySelect: (value: any) => void;
  selectedCurrency?: any;
  otherSelectedCurrency?: any;
}

const TokenSelect = (props: TokenSelectProps) => {
  const { TokenSelectModal } = useAdapterContext();

  return (
    <TokenSelectModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      onCurrencySelect={props.onCurrencySelect}
      selectedCurrency={props.selectedCurrency}
      otherSelectedCurrency={props.otherSelectedCurrency}
    />
  );
};

const TokenPanel = ({ children, isSrcToken }: TokenPanelProps) => {
  const { toggleTokenList, onTokenSelect, tokenListOpen, inputWarning, amountPrefix, disabled, selectTokenWarning, logo, symbol, onChange, value } =
    hooks.useTokenPanel(isSrcToken);
  const { translations } = useTwapContext();

  const { marketPrice } = hooks.useMarketPrice();

  const onOpen = () => {
    if (!selectTokenWarning) toggleTokenList(true);
  };

  const onTokenSelected = useCallback((token: any) => {
    onTokenSelect(parseToken(token));
  }, []);

  const onClose = useCallback(() => {
    toggleTokenList(false);
  }, []);

  return (
    <>
      <TokenSelect isOpen={tokenListOpen} onClose={onClose} onCurrencySelect={onTokenSelected} selectedCurrency={undefined} otherSelectedCurrency={undefined} />

      <StyledTokenPanel>
        <StyledColumnGap>
          <StyledFlexBetween>
            <StyledPanelLabel>{isSrcToken ? translations.from : translations.to}</StyledPanelLabel>
            {children}
            {!isSrcToken && marketPrice !== "0" && (
              <Components.Tooltip text={marketPrice}>
                <Components.Text>
                  Price <Components.NumberDisplay value={marketPrice} /> {symbol}
                </Components.Text>
              </Components.Tooltip>
            )}
          </StyledFlexBetween>
          <StyledColoredFlex gap={20} style={{ borderBottomLeftRadius: !isSrcToken ? "0px" : "", borderBottomRightRadius: !isSrcToken ? "0px" : "" }}>
            <Components.Tooltip text={inputWarning}>
              <StyledNumbericInput prefix={amountPrefix} loading={false} disabled={disabled} placeholder="0.0" onChange={onChange || (() => {})} value={value} />
            </Components.Tooltip>
            <Components.Tooltip text={selectTokenWarning}>
              <StyledTokenSelect onClick={onOpen} style={{ background: symbol ? "" : "rgb(255, 200, 0)" }}>
                {symbol ? (
                  <TokenDisplay logo={logo} name={symbol} />
                ) : (
                  <Components.Text style={{ color: symbol ? "" : "black", fontWeight: 500 }}>{translations.selectToken}</Components.Text>
                )}
                <StyledIcon icon={<IoIosArrowDown size={20} style={{ fill: symbol ? "" : "black" }} />} />
              </StyledTokenSelect>
            </Components.Tooltip>
          </StyledColoredFlex>
        </StyledColumnGap>
      </StyledTokenPanel>
    </>
  );
};

const PlaceOrderButton = () => {
  const { loading, text, onClick, disabled } = hooks.useShowConfirmationButton();
  return (
    <StyledButton loading={loading} onClick={onClick || (() => {})} disabled={disabled}>
      {text}
    </StyledButton>
  );
};

const OrderConfirmation = () => {
  const { srcToken, dstToken, srcUsd, srcAmount, dstUsd, dstAmount, isLimitOrder, showConfirmation, closeConfirmation, disclaimerAccepted, setDisclaimerAccepted, maker } =
    hooks.useOrderOverview();
  const { loading, text, onClick, disabled } = hooks.useCreateOrderButton();
  const translations = useTwapContext().translations;

  return (
    <>
      <StyledTradeInfoModal open={showConfirmation} onClose={closeConfirmation}>
        <StyledOrderConfirmation>
          <StyledColumnGap gap={20}>
            <StyledColumnGap gap={20}>
              <TokenOrderPreview
                isSrc={true}
                isLimitOrder={isLimitOrder}
                title={translations.from}
                amount={srcAmount}
                usdPrice={srcUsd}
                name={srcToken?.symbol}
                logo={srcToken?.logoUrl}
              />
              <TokenOrderPreview isLimitOrder={isLimitOrder} title={translations.to} amount={dstAmount} usdPrice={dstUsd} name={dstToken?.symbol} logo={dstToken?.logoUrl} />
              <OrderConfirmationLimitPrice />

              <StyledCard>
                <StyledColumnGap className="trade-info-explanation" gap={20}>
                  <Components.ConfirmationExpiration />
                  <Components.ConfirmationOrderType />
                  <Components.ConfirmationTradeSize />
                  <Components.ConfirmationTotalTrades />
                  <Components.ConfirmationTradeInterval />
                  <Components.ConfirmationMinimumReceived />
                </StyledColumnGap>
              </StyledCard>
              <TradeInfoDetailsDisplay />
            </StyledColumnGap>
            <StyledColumnGap gap={12}>
              <Box style={{ display: "flex", gap: 5 }}>
                <Components.SmallLabel>{translations.acceptDisclaimer}</Components.SmallLabel>
                <StyledSwitch value={disclaimerAccepted} onChange={() => setDisclaimerAccepted(!disclaimerAccepted)} />
              </Box>
              <Components.Text className="output-text">{translations.outputWillBeSentTo}</Components.Text>
              <Components.Text className="output-text">{maker}</Components.Text>
              <StyledButton loading={loading} onClick={onClick || (() => {})} disabled={disabled}>
                {text}
              </StyledButton>
            </StyledColumnGap>
          </StyledColumnGap>
        </StyledOrderConfirmation>
      </StyledTradeInfoModal>
    </>
  );
};

const TradeInfoDetailsDisplay = () => {
  return (
    <StyledCard>
      <StyledColumnGap gap={10}>
        <Components.TradeInfoExplanation />
      </StyledColumnGap>
    </StyledCard>
  );
};

const OrderConfirmationLimitPrice = () => {
  const { isLimitOrder, toggleInverted, limitPrice, leftToken, rightToken } = hooks.useLimitPrice();
  const translations = useTwapContext().translations;

  return (
    <StyledLimitPrice>
      <StyledFlexBetween>
        <Components.Label tooltipText={translations.confirmationLimitPriceTooltip}>{translations.limitPrice}</Components.Label>
        {isLimitOrder ? (
          <Components.TokenPriceCompare leftToken={leftToken} rightToken={rightToken} price={limitPrice} toggleInverted={toggleInverted} />
        ) : (
          <Components.Text>{translations.none}</Components.Text>
        )}
      </StyledFlexBetween>
    </StyledLimitPrice>
  );
};

const TokenOrderPreview = ({
  isLimitOrder,
  title,
  logo,
  name,
  usdPrice,
  amount,
  isSrc,
}: {
  isLimitOrder?: boolean;
  title: string;
  logo?: string;
  name?: string;
  usdPrice?: string;
  amount?: string;
  isSrc?: boolean;
}) => {
  return (
    <StyledTokenOrder>
      <StyledCard>
        <StyledColumnGap gap={10}>
          <StyledFlexBetween>
            <Components.Label>{title}</Components.Label>
            <StyledUSD value={usdPrice} />
          </StyledFlexBetween>
          <StyledFlexBetween>
            <TokenDisplay name={name} logo={logo} />
            <StyledTokenOrderPreviewAmount>
              {!isSrc && <> {isLimitOrder ? "≥ " : "~ "}</>} <Components.NumberDisplay value={amount} />
            </StyledTokenOrderPreviewAmount>
          </StyledFlexBetween>
        </StyledColumnGap>
      </StyledCard>
    </StyledTokenOrder>
  );
};

const StyledTokenOrderPreviewAmount = styled(Components.SmallLabel)({
  fontSize: 19,
});