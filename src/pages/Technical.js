import React, { Component } from "react";

export default class References extends Component {
  render() {
    return (
      <div>
        <h2>Technical</h2>

        Configured API Server URL: {process.env.REACT_APP_GROWTH_API_BASEURL}
      </div>
    );
  }
}