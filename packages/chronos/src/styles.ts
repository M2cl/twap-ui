import { Box, styled } from "@mui/material";
import { Styles } from "@orbs-network/twap-ui";
import { StylesConfig } from "@orbs-network/twap-ui";




interface Styles extends StylesConfig {
  fromGradient: string;
  toGradient: string;
}

export const darkModeStylesConfig: Styles = {
  primaryColor: "#356ff4",
  fromGradient: "#9e5bf1",
  toGradient: "#356ff4",
  iconsColor: "#356ff4",
  textColor: "white",
  tooltipBackground: "black",
  tooltipTextColor: "white",
  disabledButtonBackground: "",
  spinnerColor: "white",
  containerBackground: "rgb(10 9 62/1)",
  cardBackground: "rgb(255 255 255/0.5)",
  progressBarColor: "#356ff4",
  progressBarTrackColor: "rgb(10 9 62/1)",
  orderHistorySelectedTabBackground: "#134DC8",
  orderHistoryTabColor: "",
  orderHistorySelectedTabColor: "rgb(96, 230, 197)",
  buttonBackground: "#448aff",
  buttonColor: "white",
  disabledButtonColor: "#c7cad9",
  selectTokenBackground: "linear-gradient(180deg,#448aff,#004ce6)",
  selectTokenTextColor: "white",
  selectedTokenBackground: "#404557",
  selectedTokenTextColor: "#c7cad9",
};
export const lightModeStylesConfig: Styles = {
  fromGradient: "#9e5bf1",
  toGradient: "#356ff4",
  primaryColor: "#356ff4",
  iconsColor: "#356ff4",
  textColor: "rgb(10 9 62/1)",
  tooltipBackground: "black",
  tooltipTextColor: "white",
  spinnerColor: "#356ff4",
  containerBackground: "rgb(224 239 253/1)",
  cardBackground: "rgb(255 255 255/1)",

  progressBarColor: "linear-gradient(180deg,#448aff,#004ce6)",
  progressBarTrackColor: "#c7cad9",
  orderHistorySelectedTabBackground: "#134DC8",
  orderHistoryTabColor: "",
  orderHistorySelectedTabColor: "rgb(96, 230, 197)",
  buttonBackground: "#448aff",
  buttonColor: "#656565",
  disabledButtonBackground: "",
  disabledButtonColor: "#c7cad9",
  selectTokenBackground: "linear-gradient(180deg,#448aff,#004ce6)",
  selectTokenTextColor: "white",
  selectedTokenBackground: "transparent",
  selectedTokenTextColor: "#404557",
  selectedTokenBorderColor: "#656565",
};


  const card = {
    padding: "20px",
    borderRadius: 10,
    position: "relative",
    "*": {
      zIndex: 1,
    },
    "&:after": {
      pointerEvents: "none",
      borderRadius: 30,
      left: 0,
      top: 0,
      content: "''",
      background: lightModeStylesConfig.cardBackground,
      position: "absolute",
      opacity: 0.5,
      mixBlendMode: "overlay",
      width: "100%",
      height: "100%",
      zIndex: 0,
    },
    ".dark": {
      "&:after": {
        background: darkModeStylesConfig.cardBackground,
      },
    },
  };

  export const StyledCard = styled(Styles.Card)({});

  

export const StyledColumnFlex = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const StyledChange = styled(Box)({
  position: "relative",
  height: 0,
  display: "flex",
  justifyContent: "center",
  width: "100%",
  alignItems: "center",
  zIndex: 1,
});

export const configureStyles = (isDarkMode?: boolean) => {
  const styles = isDarkMode ? darkModeStylesConfig : lightModeStylesConfig;

  const stops = `${styles.fromGradient},${styles.toGradient}`;
  const gradient = `linear-gradient(to right,${styles.fromGradient},${styles.toGradient} )`;



  return {
    ".twap-change-tokens-order": {
      maxWidth: 46,
      height: 46,
      background: styles.primaryColor,
      borderRadius: 10,
      svg: {
        color: "white",
        "*": {
          color: "white",
        },
      },
    },
    ".twap-limit-price-input": {
      ...card,
      padding: "10px 15px",
    },
    ".twap-time-selector-list": {
      background: "rgb(10 9 62/1)",
    },
    ".twap-time-selector-list-item": {
      "&:hover": {
        background: "rgba(255,255,255, 0.05)",
      },
    },
    ".twap-time-selector": {
      ".twap-input": {
        input: {
          fontSize: 18,
          color: `${styles.textColor}!important`,
          "&::placeholder": {
            color: `${styles.textColor}!important`,
            opacity: 0.5,
          },
        },
      },
    },
    ".twap-time-selectore-selected": {
      ...card,
      padding: "5px 15px",
    },
    ".twap-label": {
      fontSize: "16px",
      fontWeight: "700",
      p: {
        fontSize: "inherit",
        fontWeight: "inherit",
      },
    },

    ".twap-trade-size": {
      ".twap-chunks-size": {
        ".twap-label": {
          fontSize: 15,
          fontWeight: 500,
        },
      },
      ".twap-token-logo": {
        width: 18,
        height: 18,
      },
      ".twap-token-name": {
        fontSize: 14,
      },
      ".twap-input": {
        height: "100%",
        input: {
          fontSize: 16,
        },
      },

      ".MuiSlider-rail": {
        color: "#40475A",
      },
      ".MuiSlider-track": {
        color: styles.primaryColor,
      },
    },

    ".twap-percent-selector": {
      ".twap-card": {
        padding: "5px 12px",
        borderRadius: 12,
      },
      button: {
        padding: 0,
        background: "transparent",
        border: "unset",
        fontWeight: `300!important`,
        fontSize: 12.8,
        textTransform: "uppercase" as const,
        cursor: "pointer",
        color: styles.textColor,
        position: "relative",
        zIndex: 1,
      },
    },
    ".twap-warning": {
      opacity: 1,
      p: {
        fontSize: 14,
      },
      "*": {
        fill: "rgb(255 0 0/1)!important",
        color: "rgb(255 0 0/1)!important",
      },
    },
    ".twap-odnp": {
      marginRight: "0px!important",
      width: 119,
      minWidth: 119,
      height: 31,
      border: "1px solid #636679",
      borderRadius: "20px!important",
      padding: "0 10px!important",

      p: {
        fontSize: "13px!important",
        fontWeight: "500!important",
      },
      img: {
        width: "17px!important",
        height: 17,
      },
      color: styles.textColor,
      background: "transparent",
    },
    ".twap-input-loader": {
      right: 0,
      left: "unset",
    },

    ".twap-token-select": {
      img: {
        width: 70,
        height: 70,
      },
      svg: {
        minWidth: 70,
        minHeight: 70,
      },
    },
    ".twap-token-not-selected": {},

    ".twap-token-selected": {
      background: `${styles.selectedTokenBackground}!important`,
      p: {
        fontSize: 16,
      },
    },

    ".twap-market-price": {
      padding: "0px 20px 0px 0px",

      ".title": {
        minHeight: 40,
        borderRadius: 30,
        height: "100%",
        background: `linear-gradient(to left,transparent, ${stops})`,
        flex: 1,
        paddingLeft: 20,
        whiteSpace: "nowrap",
        color: "white",
      },
      img: {
        width: "25px!important",
        minWidth: "25px!important",
        height: "25px!important",
        minHeight: "25px!important",
      },
      p: {
        color: styles.textColor,
        display: "flex",
        alignItems: "center",
        fontSize: "15px",
        fontWeight: "500",
      },
    },

    ".twap-tooltip": {
      "& .MuiTooltip-tooltip": {
        backgroundColor: styles.tooltipBackground,
        borderRadius: "4px",
        color: styles.tooltipTextColor,
        fontSize: 14,
        fontFamily: "inherit",
        lineHeight: 1.5,
        maxWidth: 400,
        padding: 10,
        "& *": {
          color: styles.tooltipTextColor,
          fontSize: 14,
        },
      },
      "& .MuiTooltip-arrow": {
        color: styles.tooltipBackground,
      },
    },
    ".twap-loader": {
      backgroundColor: `${styles.skeletonLoaderBackground || "rgba(255,255,255, 0.1)"}!important`,
    },

    ".twap-button-loader": {
      color: `${styles.spinnerColor}!important`,
    },
    ".twap-spinner": {
      color: `${styles.spinnerColor}!important`,
    },

    ".twap-card": {
      ...card,
    },
    ".twap-container": {
      padding: 0,
      width: "100%",
      fontWeight: 500,
      "*": {
        color: styles.textColor,
        fontFamily: "inherit!important",
        letterSpacing: ".01em!important",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    },
    ".twap-small-label": {
      fontSize: 14,
      fontWeight: "500!important",
    },
    ".twap-slider": {
      "& .MuiSlider-valueLabel": {
        background: styles.tooltipBackground,
        boxShadow: "none!important",
      },
      "& .MuiSlider-valueLabelLabel": {
        color: styles.tooltipTextColor,
      },
      "& .MuiSlider-thumb": {
        background: styles.primaryColor,
        width: 13,
        height: 13,
      },
    },

    ".twap-token-name": {
      fontSize: 18,
    },
    ".twap-token-logo": {
      width: 25,
      height: 25,
    },
    ".twap-switch": {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0!important",
      position: "relative",
      zIndex: 10,
      "& .MuiSwitch-thumb": {
        width: 16,
        height: 16,
        background: styles.primaryColor,
        zIndex: 0,
      },
      "& .MuiSwitch-track": {
        width: 46,
        height: 24,
        borderRadius: 20,
        border: `1px solid ${styles.primaryColor}`,
        background: styles.containerBackground,
      },
      "& .Mui-checked+.MuiSwitch-track": {
        padding: "0!important",
        opacity: "1!important",
        background: `${styles.containerBackground}!important`,
      },
      "& .Mui-checked .MuiSwitch-thumb": {
        padding: "0!important",
      },
      "& .MuiSwitch-switchBase": {
        top: 11,
        left: 17,
        padding: "0!important",
      },
    },
    ".twap-order-expanded": {
      ".twap-market-price-section": {
        p: {
          fontSize: "13px!important",
          lineHeight: 2,
        },
        ".twap-small-label p": {
          fontSize: "14px!important",
          fontWeight: "500!important",
        },
      },
      ".twap-order-expanded-cancel-wraper": {
        width: "100%",
        display: "flex",
        justifyContent: "center",
      },
      ".twap-button": {
        margin: "15px auto",
        width: 160,
        maxWidth: 160,
        height: 40,
        border: "1px solid #636679",
      },
      ".twap-order-expanded-colored": {
        ".twap-token-display-amount-and-symbol": {
          fontSize: "16px!important",
        },
        ".twap-order-token-display-usd": {
          p: {
            fontSize: 13,
            span: {
              fontSize: 13,
            },
          },
        },

        ".twap-order-token-display": {
          ".twap-token-logo": {
            width: 25,
            height: 25,
          },
        },
      },
      display: "block!important",
      paddingTop: "0!important",
    },
    ".twap-order": {
      border: "unset",
      padding: 20,
      background: "transparent",
      ".MuiCollapse-root": {
        transition: "0s all!important",
      },

      ".twap-order-main-progress-bar": {
        background: styles.progressBarTrackColor,
      },
      ".twap-order-progress": {
        height: 6,
        borderRadius: 4,
        background: gradient,
        ".MuiLinearProgress-bar": {
          background: "inherit",
        },
      },
    },
    ".twap-chunks-size": {
      ".twap-token-logo": {
        width: 20,
        height: 20,
      },
    },
    ".twap-orders": {
      paddingBottom: 24,
      fontWeight: 500,
      color: styles.textColor,
      "*": {
        fontWeight: "inherit!important",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    },
    ".twap-orders-header": {
      ...card,
      paddingBottom: "20px!important",
      ".twap-orders-header-tabs": {
        border: "unset",

        ".twap-orders-header-tabs-tab": {
          transition: "0.1s all",
          borderRadius: 10,
        },
        "& .MuiTabs-indicator": {
          display: "none",
        },
        "& .MuiButtonBase-root": {
          color: isDarkMode ? "white" : styles.primaryColor,
          fontWeight: "600!important",
        },
        "& .Mui-selected": {
          background: styles.primaryColor,
          color: "white",
        },
      },
    },
    ".twap-token-panel": {
      padding: "20px 0px 20px 20px",
      ".twap-token-name": {
        background: "rgb(241 245 249/0.1)",
        borderRadius: 100,
        padding: "4px 8px",
        fontSize: 13,
      },
      ".twap-input": {
        input: {
          fontSize: 31,
          fontWeight: `500!important`,
          textAlign: "left" as const,
        },
      },
    },
    ".twap-input": {
      "& input": {
        color: styles.textColor,
        fontFamily: "inherit",
        textIndent: 0,
        outline: "1px solid transparent",
        borderRadius: "0.375rem",
        transition: "0.15s all",
        paddingRight: 0,
      },
    },
    ".twap-button": {
      height: 50,
      width: "100%!important",
      borderRadius: 8,
      background: gradient,
      color: "white",
      fontWeight: `700!important`,
      fontSize: "14px!important",
      textTransform: "uppercase",
      "& *": {
        color: "inherit",
        fontWeight: "inherit",
        fontSize: "inherit",
      },
    },
    ".twap-submit": {
      color: "white!important",
    },
    ".twap-button-disabled": {
      background: styles.disabledButtonBackground,
      color: `white!important`,
    },

    "#twap-modal-content": {
      maxWidth: 600,
      width: "calc(100% - 30px)",
      fontSize: "14px",
      fontFamily: "inherit",
      padding: 20,
      paddingTop: 50,
      background: styles.containerBackground,
      border: `2px solid ${styles.primaryColor}`,
      "*": {
        fontFamily: "Space Grotesk",
        color: "inherit",
      },
      ".twap-label": {
        p: {
          fontSize: "15px",
          fontWeight: "500",
        },
      },

      ".twap-orders-summary-token-display": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        ".twap-token-logo": {
          width: 30,
          height: 30,
        },
        ".twap-orders-summary-token-display-amount": {
          fontSize: 16,
        },
      },
      ".twap-disclaimer-text p, .twap-disclaimer-text a": {
        fontSize: "14px",
      },
      maxHeight: "85vh",
      overflow: "auto",
      borderRadius: "24px",
      color: styles.textColor,
      "& a": {
        color: styles.textColor,
        fontWeight: 500,
        textDecoration: "underline",
      },
      "& .MuiIconButton-root": {
        color: styles.textColor,
      },

      ".twap-order-summary-limit-price": {
        paddingRight: 20,
        ".twap-label": {
          whiteSpace: "nowrap",
          background: `linear-gradient(to left,transparent, ${stops})`,
          minHeight: 40,
          paddingLeft: 20,
          borderRadius: 30,
          flex: 1,
          color: "white",
        },
      },
    },

    ".twap-powered-by": {
      marginTop: "24px!important",
      marginBottom: "0px!important",
      p: {
        fontSize: "11px!important",
        fontWeight: "400!important",
      },
      img: {
        width: "18px!important",
        height: "18px!important",
      },
    },
    ".twap-input input": {
      paddingRight: "0!important",
    },

    ".twap-balance": {
      borderRadius: "12px 2px 0px 12px",
      overflow: "hidden",
      marginLeft: "auto",
      padding: "4px 8px",
      background: `linear-gradient(to right,${stops})`,
      maxWidth: "unset!important",
      position: "absolute!important",
      right: 0,
      top: 0,
      ".twap-number-display": {
        fontWeight: "600!important",
      },
      "*": {
        color: "white",
      },
      ".twap-balance-title": {
        fontWeight: 400,
        fontSize: 14,
      },

      "&>p": {
        flexDirection: "column",
        display: "flex",
      },
    },
    ".adapter-wrapper": {
      fontFamily: "inherit",
    },

    ".twap-order-separator": {
      display: "none",
    },

    ".odnp *": {
      color: "black",
    },

    ".twap-orders-wrapper": {
      fontFamily: "inherit",
      maxWidth: "100%!important",
      borderRadius: 10,
      "p, span": {
        fontFamily: "inherit",
      },
    },

    ".MuiBackdrop-root": {
      backdropFilter: "blur(15px)",
      background: "rgba(0,0,0,.4)!important",
    },
    "@media(max-width:550px)": {
      ".twap-percent-selector": {
        ".twap-card": {
          padding: "5px 6px",
        },
        button: {
          fontSize: 11,
        },
      },
      ".twap-token-select": {
        ".twap-token-logo": {
          width: 50,
          height: 50,
        },
      },
      ".twap-card": {
        padding: "20px 10px",
      },
      ".twap-balance": {
        ".twap-balance-title": {
          display: "none",
        },
      },
      "#twap-modal-content": {
        ".twap-order-summary-limit-price": {
          flexWrap: "wrap",
        },
        ".twap-order-summary-details-item ": {
          flexDirection: "column",
          alignItems: "flex-start",
        },
      },
      ".twap-token-panel": {
        overflow: "hidden",
        " .twap-input": {
          input: {
            fontSize: 20,
          },
        },
      },
      ".twap-market-price": {
        flexWrap: "wrap",
      },
      ".twap-limit-price-input": {
        ".twap-token-display img": {
          display: "none",
        },
      },
    },
  };
};