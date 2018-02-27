import React from 'react';
import PropTypes from 'prop-types';
import Code from 'react-code-prettify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'semantic-ui-react';
import './Code.css';

const CodeBlock = props => {
  const { code } = props;

  return (
    <div className="code-block">
      <Code codeString={code} language="javascript" />
      <div className="copy-button">
        <CopyToClipboard text={code}>
          <Button color="blue" content="Copy" />
        </CopyToClipboard>
      </div>
    </div>
  );
};

CodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
};

export default CodeBlock;
