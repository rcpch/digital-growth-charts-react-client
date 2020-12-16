import React, { Component } from "react";
import { Sidebar, Menu, Icon, Header } from "semantic-ui-react";

export default class Technical extends Component {
  render() {
    return (
      <div>
        <Sidebar
          as={Menu}
          animation="push"
          direction="right"
          icon="labeled"
          inverted
          vertical
          visible={false}
          width="wide"
        >
          <Header inverted>Technical</Header>
          <Menu.Item as="a">
            <Icon inverted name="server" />
            Configured API Server URL:
            {process.env.REACT_APP_GROWTH_API_BASEURL}
          </Menu.Item>
          <Menu.Item as="a">
            <Icon name="gamepad" />
            Games
          </Menu.Item>
          <Menu.Item as="a">
            <Icon name="camera" />
            Channels
          </Menu.Item>
        </Sidebar>
      </div>
    );
  }
}
