import React from 'react';
import PropTypes from 'prop-types';
import Code from 'react-code-prettify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'semantic-ui-react';
import './Code.css';

const CodeBlock = props => {
  const { code } = props.settings;

  return (
    <div className="code-block">
      <Code codeString={code || '// No code loaded...'} language="javascript" />
      {code && (
        <div className="copy-button">
          <CopyToClipboard text={code}>
            <Button color="blue" content="Copy" />
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
};

CodeBlock.propTypes = {
  settings: PropTypes.object.isRequired,
};

export default CodeBlock;
