import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { Button, Icon } from 'semantic-ui-react';
import './Dropzone.css';

const UploadDropzone = (props) => {
  let dropzoneRef;

  const onDrop = (accepted) => {
    if (accepted.length > 0) {
      props.handleFile(accepted[0]);
    }
  };

  const buttonHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzoneRef.open();
  }

  return (
    <Dropzone
      ref={(node) => { dropzoneRef = node; }}
      className="dropzone"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      onDrop={onDrop}>
      <Icon name="cloud upload" size="huge" />
      <p>Drop zip file to upload</p>
      <Button
        color="blue"
        onClick={buttonHandler}
        content="Or Click to Select File" />
    </Dropzone>
  );
}

UploadDropzone.propTypes = {
  handleFile: PropTypes.func.isRequired,
};

export default UploadDropzone;
