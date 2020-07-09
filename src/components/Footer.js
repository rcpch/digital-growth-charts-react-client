import React, { Component } from 'react'
import { Menu, Label } from 'semantic-ui-react'

export default class Footer extends Component {
    render() {
        return (
            <Menu>
                <Menu.Item disabled>
                    (c) Copyright RCPCH
                </Menu.Item>
                <Menu.Item position="right">
                    <Label>
                        Follow the project
                    </Label>
                </Menu.Item>
                <Menu.Item >
                    RCPCH
                </Menu.Item>
            </Menu>
        );
    }
}