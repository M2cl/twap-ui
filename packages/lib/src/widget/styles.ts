import { createGlobalStyle } from "styled-components";

const getColors = (isDarkMode?: boolean) => {
  return {
    text: {
      main: isDarkMode ? "white" : "black",
      error: isDarkMode ? "#FF5F52" : "#FF5F52",
      dark: isDarkMode ? "rgb(155, 155, 155)" : "rgb(155, 155, 155)",
    },
  };
};

const getSelectButton = (isDarkMode?: boolean, selected?: boolean) => {
  return {
    color: selected ? "white" : "rgb(155, 155, 155)",
    padding: "2px 8px",
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "999px",
    background: selected ? "rgba(255, 255, 255, 0.07)" : "transparent",
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.07)",
      color: "white",
    },
  };
};

export const GlobalStyles = createGlobalStyle<{ isDarkMode?: boolean }>(({ isDarkMode }) => {
  const colors = getColors(isDarkMode);
  return {
    ".twap-orders": {
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
    ".twap-orders__button": {
      padding: 16,
      background: "#1B1B1B",
      borderRadius: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      height: 48,
      color: colors.text.main,
      fontSize: 14,
      border: "1px solid rgba(255, 255, 255, 0.1)",
      cursor: "pointer",
      "&:hover": {
        background: "rgba(255, 255, 255, 0.07)",
      },
      svg: {
        marginLeft: "auto",
      },
    },
    ".twap-widget-swap-panel-form": {
      display: "flex",
      flexDirection: "column",
    },
    ".twap-submit-button": {
      marginTop: 20,
    },
    ".twap-orders__selected-order-bottom": {
      marginTop: 20,
      width: "100%",
    },
    ".twap-orders__selected-order-summary": {
      padding: 12,
    },
    ".twap-create-order-bottom": {
      marginTop: 20,
      display: "flex",
      gap: 10,
      flexDirection: "column",
      width: "100%",
    },
    ".orbs_MainTokenLeft": {
      gap: 2,
    },
    ".twap-orders__selected-order-summary-title": {
      fontWeight: 500,
      fontSize: 14,
    },
    ".twap-orders__selected-order-details": {
      gap: 5,
      padding: 12,
      paddingTop: 0,
    },
    ".twap-order-details": {
      gap: 8,
      display: "flex",
      flexDirection: "column",
    },
    ".twap-orders__selected-order-accordions": {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginTop: 20,
    },
    ".twap-cancel-order": {
      marginTop: 20,
    },
    ".twap-orders__selected-order-accordion": {
      borderRadius: 16,
      background: "#1B1B1B",
      "&-trigger": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 12px 12px 12px",
        cursor: "pointer",
        fontSize: 15,
      },
      "&-details": {
        padding: "5px 12px 12px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      },
    },
    ".twap-order-details__detail-row": {
      "&-label": {
        "*": {
          fontSize: 14,
          fontWeight: 500,
        },
      },
      "&-value": {
        fontSize: 14,
      },
    },
    ".twap-order-details__fill-delay-text": {
      fontSize: 14,
      fontWeight: 500,
    },
    ".twap-duration-panel": {
      marginTop: 5,
    },
    ".twap-create-order-details": {
      padding: 12,
      background: "#1B1B1B",
      borderRadius: 16,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    },
    ".orbs_Logo img": {
      objectFit: "cover",
    },

    ".twap-orders__list-item-progress": {
      display: "flex",
      alignItems: "center",
      gap: 15,
    },
    ".twap-orders__list-item-progress-bar": {
      flex: 1,
      background: "rgba(255, 255, 255, 0.07)",
      height: 5,
      borderRadius: 999,
      overflow: "hidden",
    },
    ".twap-orders__list-item-progress-bar-filled": {
      background: "rgb(252, 114, 255)",
      height: "100%",
    },
    ".twap-loader": { background: "rgba(255, 255, 255, 0.07)" },
    ".twap-orders__list-item-token-logo": {
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: 999,
    },
    ".twap-orders__selected-order-header": {
      gap: 10,
      marginBottom: 20,
      "&-title": {
        fontSize: 13,
      },
    },
    ".twap-orders__list": {
      maxHeight: "60vh",
      height: 700,
    },
    ".twap-orders__list-item": {
      cursor: "pointer",
      background: "#1B1B1B",
      padding: 12,
      borderRadius: 16,
      marginBottom: 6,
      "&:hover": {
        background: "rgba(255,255,255, 0.06)",
      },
      "&-header": {
        "&-title": {
          fontSize: 13,
          span: {
            fontSize: 12,
            opacity: 0.7,
          },
        },
        "&-status": {
          fontSize: 13,
          opacity: 0.7,
        },
      },
    },

    ".twap-order-modal-disclaimer": {
      p: {
        color: colors.text.main,
      },
      a: {
        color: colors.text.main,
        textDecoration: "underline",
      },
    },

    ".twap-select-menu-button": {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 5,
      borderRadius: 10,
      border: "1px solid rgba(255, 255, 255, 0.07)",
      padding: "6px 10px",
      background: "transparent",
      svg: {
        width: 18,
        height: 18,
        color: "rgb(155, 155, 155)",
      },
      "&:hover": {
        background: "rgba(255, 255, 255, 0.07)",
      },
    },
    ".twap-select-menu-list": {
      background: "#1B1B1B",
      border: "1px solid rgba(255, 255, 255, 0.07)",
      padding: "6px",
      borderRadius: 10,
      "&-item": {
        borderRadius: 8,
        fontSize: 14,
        "&:hover": {
          background: "rgba(255, 255, 255, 0.07)",
        },
      },
    },
    ".twap-trade-interval-panel-input": {
      input: {
        fontSize: 20,
      },
    },
    ".twap-trades-amount-panel-input": {
      input: {
        fontSize: 20,
      },
    },
    ".twap-trades-amount-panel-text": {
      color: colors.text.dark,
      fontSize: 14,
    },
    ".twap-warning-message": {
      padding: 16,
      background: "#1B1B1B",
      borderRadius: 20,
      color: colors.text.main,
      fontSize: 14,
      a: {
        color: "white",
        fontWeight: 500,
        textDecoration: "underline",
        "&:hover": {
          opacity: 0.7,
        },
      },
      svg: {
        top: 2,
        position: "relative",
        width: 16,
        height: 16,
      },
    },

    ".twap-error-message ": {
      color: colors.text.error,
      fontSize: 14,
      paddingTop: 10,
      svg: {
        position: "relative",

        width: 17,
        height: 17,
        top: 2,
      },
    },
    ".twap-input-loader": {
      background: "rgba(255,255,255, 0.2)",
      borderRadius: 8,
      maxWidth: "80%",
      height: "80%",
    },
    ".twap-input-loading": {
      opacity: 0,
    },
    ".twap-powered-by": {
      a: {
        color: colors.text.main,
      },
    },
    ".twap-price-switch ": {
      display: "flex",
      marginLeft: "auto",
      color: colors.text.main,
      alignItems: "center",
      marginBottom: 10,
      gap: 10,
      p: {
        fontWeight: 500,
        fontSize: 14,
      },
    },
    ".twap-switch": {
      background: "rgb(94, 94, 94)",
    },
    ".twap-switch-checked": {
      background: "rgb(252, 114, 255)",
    },
    ".twap-switch-handle": {
      background: "white",
    },
    ".twap-widget": {
      width: "100%",
    },
    ".twap-widget-swap-panel-top": {
      display: "flex",
      flexDirection: "column",
      gap: 2,
    },
    ".twap-button": {
      height: 50,
      padding: "0px 20px",
      borderRadius: 20,
      background: "rgb(59 130 246)",
      color: "white",
      fontSize: 15,
      fontWeight: 500,
      "&-enabled": {
        "&:hover": {
          background: "rgb(37 99 235)",
        },
      },
    },
    ".twap-limit-price-panel-usd": {
      color: colors.text.dark,
      fontSize: 14,
      fontWeight: 500,
    },
    ".twap-limit-price-panel-invert-button": {
      width: 30,
      height: 30,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 999,
      position: "relative",
      top: -5,
      right: -5,
      svg: {
        width: 16,
        height: 16,
        color: colors.text.dark,
      },
      "&:hover": {
        background: "rgba(255, 255, 255, 0.07)",
      },
    },
    ".twap-limit-price-panel-title": {
      ".twap-token-logo": {
        width: 20,
        height: 20,
      },
      ".twap-token-select": {
        paddingRight: 6,
      },
      ".twap-token-select-symbol": {
        fontSize: 14,
      },
      ".twap-token-select-icon": {
        width: 14,
        height: 14,
      },
    },
    ".twap-limit-price-panel-title-text": {
      fontSize: 14,
      fontWeight: 500,
    },
    ".twap-switch-tokens": {
      position: "relative",
      height: 5,
      button: {
        width: 50,
        height: 50,
        border: "4px solid rgb(19, 19, 19)",
        background: "#1B1B1B",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: 16,
        color: colors.text.main,
        display: "flex",
        justifyContent: "center",
        cursor: "pointer",
        alignItems: "center",
        svg: {
          width: 22,
          height: 22,
          color: "white",
        },
        "&:hover": {
          background: "#303030",
        },
      },
    },
    ".twap-widget-swap-panel": {
      display: "flex",
      flexDirection: "column",
      gap: 5,
      color: colors.text.main,
    },
    ".twap-trade-amount-message": {
      fontSize: 14,
      fontWeight: 500,
      color: colors.text.main,
      marginTop: 20,
      "&-error": {
        color: colors.text.error,
      },
    },
    ".twap-token-select": {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 5,
      borderRadius: 999999,
      border: "1px solid rgba(255, 255, 255, 0.07)",
      padding: "4px 8px 4px 4px",
      img: {
        width: 24,
        height: 24,
        objectFit: "cover",
        borderRadius: "50%",
        overflow: "hidden",
      },
      "&-not-selected": {
        background: "rgb(252, 114, 255)",
        paddingLeft: 10,
        border: "none",
        ".twap-token-select-icon": {
          color: "white",
        },
      },
      "&-symbol": {
        fontWeight: 600,
        fontSize: 16,
      },
      "&-icon": {
        width: 20,
        height: 20,
        color: "rgb(155, 155, 155)",
      },
      "&-selected": {
        "&:hover": {
          background: "rgba(255, 255, 255, 0.07)",
        },
      },
    },
    ".twap-token-logo ": {
      width: 28,
      height: 28,
    },
    ".twap-input": {
      flex: 1,
      input: {
        fontWeight: 500,
        color: colors.text.main,
      },
    },
    ".orbs_StepIndicatorLine": {
      "--line-bg-color": "rgb(252, 114, 255)",
    },
    ".orbs_StepIndicator": {
      // "--indicator-margin-bottom": "10px",
    },
    ".twap-limit-price-panel-percent": {
      marginLeft: "auto",
      gap: 5,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },

    ".twap-limit-price-panel": {
      marginBottom: 5,
      ".twap-input": {
        input: {
          fontSize: 34,
        },
      },
    },

    ".twap-token-panel": {
      ".twap-input": {
        input: {
          fontSize: 34,
        },
      },
    },
    ".twap-token-panel-usd": {
      color: colors.text.dark,
      fontSize: 14,
      fontWeight: 500,
    },
    ".twap-panel-header": {
      marginBottom: 10,
    },
    ".twap-token-panel-balance": {
      color: colors.text.dark,
      fontSize: 14,
      fontWeight: 500,
    },
    ".orbs_MainToken": {
      alignItems: "center",

      ".orbs_MainTokenLeft": {
        display: "flex",
        flexDirection: "column",
        gap: 5,
        ".orbs_MainTokenTitle": {
          fontSize: 15,
        },
        ".orbs_MainTokenAmount": {
          fontSize: 20,
          fontWeight: 500,
        },
        ".orbs_MainTokenUsd": {
          fontSize: 13,
          opacity: 0.7,
        },
      },

      ".orbs_MainTokenLogo": {
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: 999,
        img: {
          width: 40,
          height: 40,
          objectFit: "cover",
          borderRadius: "50%",
        },
      },
    },
    ".twap-token-panel-main": {
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
    ".twap-token-panel-main-top": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    ".twap-token-panel-main-middle": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    ".twap-token-panel-main-bottom": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    ".twap-label": {
      color: colors.text.dark,
      fontWeight: 500,
      fontSize: 15,
    },
    ".twap-duration-panel-buttons ": {
      display: "flex",
      gap: 5,
    },

    ".twap-panel": {
      border: "1px solid transparent",
      padding: 16,
      background: "#1B1B1B",
      borderRadius: 20,
      color: colors.text.main,
      "&-error": {
        ".twap-input": {
          input: {
            color: colors.text.error,
          },
        },
        ".twap-token-panel-balance": {
          color: colors.text.error,
        },
      },
    },
    ".twap-panel-focused": {
      // background:'transparent',
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    ".twap-inputs": {
      display: "flex",
      alignItems: "stretch",
      gap: 5,
      marginTop: 5,
      ".twap-panel": {
        flex: 1,
      },
    },
    ".twap-select-button": {
      ...getSelectButton(isDarkMode, false),
      "&-selected": {
        ...getSelectButton(isDarkMode, true),
      },
    },
    ".twap-token-panel-balance-buttons": {
      display: "flex",
      gap: 5,
      marginLeft: "auto",
    },
    ".twap-limit-price-panel-percent-reset": {
      gap: 2,
      display: "flex",
      alignItems: "stretch",
    },
    ".twap-limit-price-panel-percent-reset-button": {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    ".twap-limit-price-panel-percent-reset-icon": {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
  };
});
