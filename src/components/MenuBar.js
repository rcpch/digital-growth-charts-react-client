import React, { Component } from "react";
import { Menu } from 'semantic-ui-react';
import { Link} from 'react-router-dom'

export default class MenuBar extends Component {
    state = {
        activeItem: 'home'
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render(){
        // const { activeItem } = this.state
        return (
            <Menu pointing secondary>
                    <Menu.Item
                        as={Link} to='/'
                        name='home'
                        active={this.state.activeItem === 'home'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        as={Link} to='/references'
                        name='references'
                        active={this.state.activeItem === 'references'}
                        onClick={this.handleItemClick}
                    />  
            </Menu>
        );
    }
}