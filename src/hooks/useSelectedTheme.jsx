import { useEffect } from 'react';

// Themes
import RCPCHTheme1 from "../components/chartThemes/rcpchTheme1";
import RCPCHTheme2 from "../components/chartThemes/rcpchTheme2";
import RCPCHTheme3 from "../components/chartThemes/rcpchTheme3";
import RCPCHThemeMonochrome from "../components/chartThemes/rcpchThemeMonochrome";
import RCPCHThemeTraditionalBoy from "../components/chartThemes/RCPCHThemeTraditionalBoy";
import RCPCHThemeTraditionalGirl from "../components/chartThemes/RCPCHThemeTraditionalGirl";

const useThemeSelector = (theme, sex, setCentileStyle, setChartSyle, setMeasurementStyle, setAxisStyle) => {
  useEffect(() => {
    let selectedTheme;
    switch (theme.value) {
      case "trad":
        selectedTheme = sex === "male" ? RCPCHThemeTraditionalBoy : RCPCHThemeTraditionalGirl;
        break;
      case "tanner1":
        selectedTheme = RCPCHTheme1;
        break;
      case "tanner2":
        selectedTheme = RCPCHTheme2;
        break;
      case "tanner3":
        selectedTheme = RCPCHTheme3;
        break;
      default:
        selectedTheme = RCPCHThemeMonochrome;
    }
    const { centiles, chart, measurements, axes } = selectedTheme;
    setCentileStyle(centiles);
    setChartSyle(chart);
    setMeasurementStyle(measurements);
    setAxisStyle(axes);
  }, [sex, theme.value, setCentileStyle, setChartSyle, setMeasurementStyle, setAxisStyle]);
};

export default useThemeSelector;
