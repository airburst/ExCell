import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Segment } from 'semantic-ui-react';
import { Code, TestModel } from '../index';
import '../../index.css';

class Main extends Component {
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
    const { timing } = this.props.settings;
    const { activeItem } = this.state;

    return (
      <div className="main">
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
          {this.state.activeItem === 'test' && (
            <Menu.Menu position="right">
              <Menu.Item>Time to calculate: {timing} ms</Menu.Item>
            </Menu.Menu>
          )}
        </Menu>

        {this.state.activeItem === 'code' && (
          <Segment attached="bottom" className="code-segment">
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

export default Main;
