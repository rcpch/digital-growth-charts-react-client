import React from 'react';
import { Grid, Segment, Tab, Checkbox, Button, Container, Message } from 'semantic-ui-react';

import ThemeSelection from "../subcomponents/ThemeSelection.jsx";
import ResultsSegment from "../ResultsSegment.jsx";

const SemanticGrid = ({
  mode,
  flip,
  FormPanes,
  handleModeChange,
  modeActiveIndex,
  results,
  reference,
  clinician,
  setClinician,
  TabPanes,
  themeOptions,
  handleChangeTheme,
  theme,
  handleCentileSDS,
  centile,
  globalState,
  handleFlipResults,
}) => {
  return (
    <Grid padded>
      <Grid.Row>
        <Grid.Column width={6}>
          <Segment textAlign="center" color={mode === "fictional-child-data" ? "black" : null}>
            <Tab
              key="measurementTabs"
              panes={FormPanes}
              menu={{
                attached: false,
                secondary: true,
                pointing: true,
              }}
              onTabChange={handleModeChange}
              activeIndex={modeActiveIndex}
            />
          </Segment>
        </Grid.Column>
        <Grid.Column width={10}>
          <Segment color={mode === "fictional-child-data" ? "black" : null}>
            {flip ? (
              <ResultsSegment apiResult={results} reference={reference} />
            ) : (
              <div>
                <TabPanes />
              </div>
            )}
            <Grid verticalAlign="middle">
              <Grid.Row columns={3}>
                <Grid.Column textAlign="left" width={4}>
                  <Checkbox
                    radio
                    label="Clinician Advice"
                    name="checkboxRadioGroup"
                    value={0}
                    checked={clinician}
                    onChange={(e, data) => setClinician(!clinician)}
                  />
                  <Checkbox
                    radio
                    label="Child/Family Advice"
                    name="checkboxRadioGroup"
                    value={1}
                    checked={!clinician}
                    onChange={(e, data) => setClinician(!clinician)}
                  />
                </Grid.Column>
                <Grid.Column textAlign="center" width={4}>
                  <ThemeSelection
                    options={themeOptions}
                    onChange={handleChangeTheme}
                    text={theme.text}
                  />
                </Grid.Column>
                <Grid.Column textAlign="right" width={8}>
                  <Button
                    onClick={handleCentileSDS}
                    color="black"
                    disabled={flip}
                  >
                    {centile ? "Show SDS Chart" : "Show Centile Charts"}
                  </Button>
                  <Button
                    disabled={!globalState.isDataPresent}
                    className="selectUpperMargin"
                    onClick={handleFlipResults}
                  >
                    {flip ? "Chart" : "Results"}
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Container>
          <Message
            icon={"warning sign"}
            header={"DISCLAIMER"}
            content="This is for demonstration purposes only and is not for clinical use."
            color="red"
          />
        </Container>
      </Grid.Row>
    </Grid>
  );
}

export default SemanticGrid