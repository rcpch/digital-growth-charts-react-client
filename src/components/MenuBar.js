import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

export default class MenuBar extends Component {
  render() {
    return (
      <Menu fluid borderless inverted color="blue" as="h2">
        <Menu.Item
          href="https://growth-blog.rcpch.ac.uk/"
          name="Growth Blog"
          position="right"
        />
        <Menu.Item
          href="https://dev.rcpch.ac.uk/"
          name="API Documentation"
          position="right"
        />
        <Menu.Item
          href="https://github.com/rcpch/growth-references"
          name="Growth References"
          position="right"
        />
        <Menu.Item
          name="Technical"
          onClick={this.handleItemClick}
          position="right"
        />
      </Menu>
    );
  }
}
