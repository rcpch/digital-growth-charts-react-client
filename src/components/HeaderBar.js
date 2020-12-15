import React, { Component } from "react";
import { Grid, GridColumn, Header, Image } from "semantic-ui-react";
import MenuBar from "./MenuBar";

export default class HeaderBar extends Component {
  render() {
    return (
      <Grid stackable>
        <Grid.Column width={4}>
          <Image src="logo-desktop.svg" size="medium" wrapped />
        </Grid.Column>
        <Grid.Column width={6}>
          <Header as="h1">Digital Growth Charts</Header>
        </Grid.Column>
        <Grid.Column width={6}>
          <MenuBar />
        </Grid.Column>
      </Grid>
    );
  }
}
