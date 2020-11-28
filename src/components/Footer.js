import React, { Component } from "react";
import { Menu, Icon, Image } from "semantic-ui-react";

export default class Footer extends Component {
  render() {
    return (
      <Menu secondary pointing icon="labeled">
        <Menu.Item href="https://www.rcpch.ac.uk/">
          <Image src="rcpch_logo.png" size="mini" />© Copyright RCPCH 2020-21
        </Menu.Item>
        <Menu.Item href="https://github.com/rcpch/digital-growth-charts-react-client">
          <Icon name="github" />
          Contribute on GitHub
        </Menu.Item>
        <Menu.Item href="https://www.thehtn.co.uk/health-tech-awards-2020-live/">
          <Image src="htn-awards-winner-2020-logo.jpg" size="mini" />
          Health Tech Awards 'Best Health Tech Solution 2020'
        </Menu.Item>
      </Menu>
    );
  }
}
