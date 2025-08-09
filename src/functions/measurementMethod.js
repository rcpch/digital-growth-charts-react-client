export const measurementMethodLabelForKey = (measurementMethod) => {
  switch (measurementMethod) {
    case "height":
      return "Height";
    case "weight":
      return "Weight";
    case "bmi":
      return "Body Mass Index";
    case "ofc":
      return "Head Circumference";
    default:
      return "Unknown";
  }
};
