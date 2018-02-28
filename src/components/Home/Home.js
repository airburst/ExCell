import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Excel from '../../services/Excel';
import makeCode from '../../services/makeCode';
import Dropzone from './Dropzone';

class Home extends Component {
  loadFile = file => {
    const { history, setCode, setModel } = this.props;
    const excel = new Excel(file);
    setModel(excel);
    setCode(makeCode(excel));
    history.push('/code');
    // history.push('/model');
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
    return <Dropzone handleFile={this.handleFile} />;
  }
}

Home.propTypes = {
  setCode: PropTypes.func.isRequired,
  setModel: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default Home;
