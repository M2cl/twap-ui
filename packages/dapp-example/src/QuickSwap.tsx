import { StyledLayoutQuickswap, StyledModalContent } from "./styles";
import { Orders, TWAP, QuickSwapTWAPProps, QuickSwapOrdersProps } from "@orbs-network/twap-ui-quickswap";
import { useConnectWallet, useNetwork } from "./hooks";
import { Configs } from "@orbs-network/twap";
import { useWeb3React } from "@web3-react/core";
import { Dapp, TokensList } from "./Components";
import { DappLayout, Popup } from "./Components";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { erc20s, zeroAddress } from "@defi.org/web3-candies";
import { TokenListItem } from "./types";
const config = Configs.QuickSwap;

const nativeTokenLogo = "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png";
export const useDappTokens = () => {
  const { account } = useWeb3React();
  const { isInValidNetwork } = useNetwork(config.chainId);

  return useQuery(
    ["useDappTokens", config.chainId],
    async () => {
      const response = await fetch(`https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/polygon.json`);

      const tokenList = await response.json();
      const parsed = tokenList
        .filter((t: any) => t.chainId === config.chainId)
        .map(({ symbol, address, decimals, logoURI, name, chainId }: any) => ({
          decimals,
          symbol,
          name,
          chainId,
          address,
          tokenInfo: { address, chainId, decimals, symbol, name, logoURI: (logoURI as string)?.replace("/logo_24.png", "/logo_48.png") },
          tags: [],
        }));
      const candiesAddresses = [zeroAddress, ..._.map(erc20s.poly, (t) => t().address)];

      const _tokens = _.sortBy(parsed, (t: any) => {
        const index = candiesAddresses.indexOf(t.address);
        return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
      });

      return { ..._.mapKeys(_tokens, (t) => t.address) } as any;
    },
    { enabled: !!account && !isInValidNetwork }
  );
};

interface TokenSelectModalProps {
  isOpen: boolean;
  selectedToken?: any;
  onCurrencySelect: (token: any) => void;
  onDismiss: () => void;
}

const parseList = (rawList?: any): TokenListItem[] => {
  return _.map(rawList, (rawToken) => {
    return {
      token: {
        address: rawToken.address ?? rawToken.tokenInfo?.address,
        decimals: rawToken.decimals ?? rawToken.tokenInfo?.decimals,
        symbol: rawToken.symbol ?? rawToken.tokenInfo?.symbol,
        logoUrl: rawToken.tokenInfo?.logoURI || nativeTokenLogo,
      },
      rawToken,
    };
  });
};

const TokenSelectModal = ({ isOpen, onCurrencySelect, onDismiss }: TokenSelectModalProps) => {
  const { data: tokensList } = useDappTokens();
  const tokensListSize = _.size(tokensList);
  const parsedList = useMemo(() => parseList(tokensList), [tokensListSize]);

  return (
    <Popup isOpen={isOpen} onClose={onDismiss}>
      <StyledModalContent>
        <TokensList tokens={parsedList} onClick={onCurrencySelect} />
      </StyledModalContent>
    </Popup>
  );
};
const logo = "https://s2.coinmarketcap.com/static/img/coins/64x64/8206.png";
const DappComponent = () => {
  const { account, library } = useWeb3React();
  const connect = useConnectWallet();
  const { data: dappTokens } = useDappTokens();
  const getTokenLogoURL = (address: string) => {
    if (!dappTokens) return "";
    const token = dappTokens[address];
    if (!token) {
      return null;
    }
    return token.tokenInfo ? token.tokenInfo.logoURI : nativeTokenLogo;
  };

  const twapProps: QuickSwapTWAPProps = {
    connect,
    account,
    srcToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    dstToken: "0x614389EaAE0A6821DC49062D56BDA3d9d45Fa2ff",
    dappTokens,
    onSrcTokenSelected: (token: any) => console.log(token),
    onDstTokenSelected: (token: any) => console.log(token),
    TokenSelectModal,
    provider: library,
    getTokenLogoURL,
  };
  const ordersProps: QuickSwapOrdersProps = { account, dappTokens, provider: library, getTokenLogoURL };

  return (
    <DappLayout name={config.partner}>
      <StyledLayoutQuickswap>
        <TWAP {...twapProps} />
      </StyledLayoutQuickswap>
      <StyledLayoutQuickswap>
        <Orders {...ordersProps} />
      </StyledLayoutQuickswap>
    </DappLayout>
  );
};

const dapp: Dapp = {
  Component: DappComponent,
  logo,
  config,
};

export default dapp;
