import React from 'react';
import { Tab } from 'semantic-ui-react';
import ChartData from '../../api/Chart.js';

const createSemanticPanes = (panesBlueprint, centile, disabled, results, reference, sex, isLoading, chartStyle, axisStyle, defaultTheme, centileStyle, sdsStyle, measurementStyle, clinician) => {
  return panesBlueprint.map((details, index) => {
    const key = centile ? `centile-${index}` : `sds-${index}`;
    return {
      menuItem: details.menuItem,
      render: () => {
        return centile ? (
          <Tab.Pane
            key={key}
            attached="top"
            disabled={disabled[details.measurementName]}
          >
            <ChartData
              key={key}
              reference={reference}
              sex={sex}
              measurementMethod={details.measurementName}
              measurementsArray={results[reference][details.measurementName]}
              midParentalHeightData={results[reference]["midParentalHeights"]}
              chartStyle={chartStyle}
              axisStyle={axisStyle}
              gridlineStyle={defaultTheme.gridlines}
              centileStyle={centileStyle}
              measurementStyle={measurementStyle}
              isLoading={isLoading}
              chartType="centile"
              clinicianFocus={clinician}
            />
          </Tab.Pane>
        ) : (
          <Tab.Pane attached="top" key={key}>
            <ChartData
              key={key}
              reference={reference}
              sex={sex}
              measurementMethod={details.measurementName}
              measurementsArray={results[reference]}
              midParentalHeightData={results[reference]["midParentalHeights"]}
              chartStyle={chartStyle}
              axisStyle={axisStyle}
              gridlineStyle={defaultTheme.gridlines}
              centileStyle={centileStyle}
              sdsStyle={sdsStyle}
              measurementStyle={measurementStyle}
              isLoading={isLoading}
              chartType="sds"
            />
          </Tab.Pane>
        );
      },
    };
  });
};

export default createSemanticPanes;