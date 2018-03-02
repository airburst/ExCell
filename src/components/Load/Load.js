import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Excel from '../../services/Excel';
import makeCode from '../../services/makeCode';
import Dropzone from './Dropzone';
import Loader from './Loader';

class Load extends Component {
  state = {
    loading: false,
  };

  loadFile = file => {
    try {
      const { history, setCode, setModel } = this.props;
      const excel = new Excel(file);
      setModel(excel);
      setCode(makeCode(excel));
      history.push('/');
    } catch (e) {
      this.setState({ loading: false });
      // Show error
      console.log(e.message);
    }
  };

  handleFile = file => {
    this.setState({ loading: true });
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
      <React.Fragment>
        {!this.state.loading && <Dropzone handleFile={this.handleFile} />}
        {this.state.loading && <Loader message="Processing spreadsheet.." />}
      </React.Fragment>
    );
  }
}

Load.propTypes = {
  setCode: PropTypes.func.isRequired,
  setModel: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default Load;
