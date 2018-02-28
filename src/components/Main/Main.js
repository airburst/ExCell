import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Segment } from 'semantic-ui-react';
import { Code, TestModel } from '../index';

export default class Main extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  state = { activeItem: 'code' };

  componentWillMount() {
    const { settings, history } = this.props;
    const { code } = settings;
    if (!code) {
      history.push('/load');
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Menu attached="top" tabular>
          <Menu.Item
            name="code"
            active={activeItem === 'code'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="test"
            active={activeItem === 'test'}
            onClick={this.handleItemClick}
          />
        </Menu>

        {this.state.activeItem === 'code' && (
          <Segment attached="bottom">
            <Code />
          </Segment>
        )}

        {this.state.activeItem === 'test' && (
          <Segment attached="bottom">
            <TestModel />
          </Segment>
        )}
      </div>
    );
  }
}
