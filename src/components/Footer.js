import React, { Component } from 'react'
import { Menu, Icon, Image } from 'semantic-ui-react'

export default class Footer extends Component {
    render() {
        return (
            <Menu secondary pointing icon='labeled'>
                <Menu.Item href='https://www.rcpch.ac.uk/'>
                    <Image src='rcpch_logo.png' circular size='mini'></Image>
                    © Copyright RCPCH
                </Menu.Item>
                <Menu.Item href="https://github.com/rcpch/digital-growth-charts-react-client">
                    <Icon name='github'/>
                    Follow the project
                </Menu.Item>
            </Menu>
        );
    }
}