import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Excel from '../../services/Excel';
import solver from '../../services/solver';
import makeCode from '../../services/makeCode';
import Dropzone from './Dropzone';

class Home extends Component {
  setInfo = excel => {
    this.setModel(solver(excel));
  };

  loadFile = file => {
    const { history, setCode } = this.props;
    const excel = new Excel(file);
    this.setInfo(excel);
    setCode(makeCode(excel));
    history.push('/code');
  };

  handleFile = file => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      this.loadFile(data);
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.readAsBinaryString(file);
  };

  render() {
    return (
      <div className="App">
        <Dropzone handleFile={this.handleFile} />
      </div>
    );
  }
}

Home.propTypes = {
  setCode: PropTypes.func.isRequired,
  setModel: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default Home;
