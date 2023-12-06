const handleChangeTheme = (
    value,
    sex,
    RCPCHTheme1,
    RCPCHTheme2,
    RCPCHTheme3,
    RCPCHThemeMonochrome,
    RCPCHThemeTraditionalBoy,
    RCPCHThemeTraditionalGirl,
    setChartSyle,
    setCentileStyle,
    setSDSStyle,
    setMeasurementStyle,
    setAxisStyle,
    setTheme
) => {
  let selectedTheme;
  let text;

  if (value === "trad") {
    if (sex === "male") {
      selectedTheme = RCPCHThemeTraditionalBoy;
    } else {
      selectedTheme = RCPCHThemeTraditionalGirl;
    }
    text = "Traditional";
  }
  if (value === "tanner1") {
    selectedTheme = RCPCHTheme1;
    text = "Tanner 1";
  }
  if (value === "tanner2") {
    selectedTheme = RCPCHTheme2;
    text = "Tanner 2";
  }
  if (value === "tanner3") {
    selectedTheme = RCPCHTheme3;
    text = "Tanner 3";
  }
  if (value === "monochrome") {
    selectedTheme = RCPCHThemeMonochrome;
    text = "Monochrome";
  }

  setCentileStyle(selectedTheme.centiles);
  setSDSStyle(selectedTheme?.sds);
  setChartSyle(selectedTheme.chart);
  setMeasurementStyle(selectedTheme.measurements);
  setAxisStyle(selectedTheme.axes);
  setTheme({ value: value, text: text });
};

export default handleChangeTheme;
