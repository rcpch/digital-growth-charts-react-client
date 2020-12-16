import React, { Component } from "react";

import {
  Segment,
  Header,
  Grid,
  Message,
  Flag,
  GridColumn,
} from "semantic-ui-react";
import MeasurementForm from "../components/MeasurementForm";

export class HeroSegment extends Component {
  render() {
    return (
      <div>
        <Segment className="hero-segment">
          <Grid>
            <Grid.Row
              basic="true"
              inverted="true"
              color="blue"
              style={{
                backgroundImage: `url(${"dynamic-child-banner-wallpaper.png"})`,
                backgroundSize: "cover",
              }}
            >
              <GridColumn>
                <Header inverted as="h1" style={{ fontSize: "4em" }}>
                  <p>Royal College of Paediatrics and Child Health</p>
                  <p>Digital Growth Charts</p>
                </Header>
                <Header inverted as="h3">
                  A first-of-its-kind 'Best Practice As Code' innovation by the
                  RCPCH. Digital clinical tools provided to developers of
                  clinician and patient facing technology.
                  <a href="https://marcus-baw.medium.com/royal-colleges-3-0-best-practice-as-code-7065bce821a7">
                    #royalcolleges3.0
                  </a>
                </Header>
                <Header inverted as="h2">
                  Free basic access to all, fully open source, and sustainably
                  managed as a non-profit enterprise.
                </Header>
              </GridColumn>
            </Grid.Row>

            <Grid.Row centered>
              <Grid.Column width={4}>
                <Message>
                  <Flag name="gb" />
                  This calculator uses the UK-WHO references to calculate gold
                  standard accurate child growth parameters. In the future we
                  are planning to add other growth references such as specialist
                  Trisomy 21 and Turner's Syndrome references, CDC and WHO.
                </Message>

                <Message color="red">
                  This site is under development. No responsibility is accepted
                  for the accuracy of results produced by this tool.
                </Message>
              </Grid.Column>

              <Grid.Column width={4}>
                <MeasurementForm
                  className="measurement-form"
                  onSubmitMeasurement={this.handleFormData}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    );
  }
}

export default HeroSegment;
