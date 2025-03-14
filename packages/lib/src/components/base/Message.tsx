import { styled } from "styled-components";
// import { RiErrorWarningLine } from "@react-icons/all-files/io/RiErrorWarningLine";
import { RiErrorWarningLine } from "@react-icons/all-files/ri/RiErrorWarningLine";

import React, { ReactNode, useMemo } from "react";
import { StyledColumnFlex, StyledRowFlex, StyledText } from "../../styles";
import { MessageVariant } from "../../types";
import { useTwapContext } from "../../context";

export function Message({ text, className = "", variant, title }: { variant: MessageVariant; title: ReactNode; text?: ReactNode; className?: string }) {
  const { components } = useTwapContext();
  const _className = useMemo(() => {
    switch (variant) {
      case "error":
        return "twap-error-message";
      case "warning":
        return "twap-warning-message";

      default:
        return "";
    }
  }, [variant]);

  const icon = useMemo(() => {
    switch (variant) {
      case "error":
        return <RiErrorWarningLine className="twap-message-icon" />;
      case "warning":
        return <RiErrorWarningLine className="twap-message-icon" />;

      default:
        return undefined;
    }
  }, [variant]);

  if (components.Message) {
    return <components.Message title={title} text={text} variant={variant} />;
  }

  return (
    <Container className={`twap-message ${_className} ${className}`}>
      {icon && icon}
      <StyledColumnFlex className="twap-message-right">
        <StyledText className="twap-message-title">{title}</StyledText>
        {text && <StyledText className="twap-message-text">{text}</StyledText>}
      </StyledColumnFlex>
    </Container>
  );
}

const Container = styled(StyledRowFlex)({
  gap: 7,
  alignItems: "flex-start",
  ".twap-message-right": {
    flex: 1,
    width: "auto",
  },
  svg: {},
});
