import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default class MenuBar extends Component {
  state = {
    activeItem: "home",
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    // const { activeItem } = this.state
    return (
      <Menu pointing secondary>
        <Menu.Item
          as={Link}
          to="/"
          name="home"
          active={this.state.activeItem === "home"}
          onClick={this.handleItemClick}
        />

        <Menu.Item href="https://growth-blog.rcpch.ac.uk/">
          <Icon name="book" />
          Growth Blog
        </Menu.Item>

        <Menu.Item href="https://dev.rcpch.ac.uk/">
          <Icon name="lab" />
          API Documentation
        </Menu.Item>

        <Menu.Item href="https://github.com/rcpch/growth-references">
          <Icon name="line graph" />
          Growth References
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item
            as={Link}
            to="/technical"
            name="technical"
            icon="code"
            active={this.state.activeItem === "technical"}
            onClick={this.handleItemClick}
          />
        </Menu.Menu>
      </Menu>
    );
  }
}
