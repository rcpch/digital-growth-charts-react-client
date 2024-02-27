import { Tab } from "semantic-ui-react";

const TabPanes = ({panes, measurementMethodActiveIndex, handleTabChange}) => (
    <Tab
      key="tabPanes"
      menu={{
        attached: "top",
        secondary: true,
        pointing: true,
      }}
      panes={panes}
      activeIndex={measurementMethodActiveIndex}
      onTabChange={handleTabChange}
    />
  );

  export default TabPanes