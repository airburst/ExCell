import React from 'react';
import PropTypes from 'prop-types';
import Code from 'react-code-prettify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import fileDownload from 'react-file-download';
import { Button } from 'semantic-ui-react';
import './Code.css';

class CodeBlock extends React.Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
  };

  download = () => {
    fileDownload(this.props.settings.code, 'Calculate.js');
  };

  render() {
    const { settings } = this.props;
    const { code } = settings;
    const codeString = code || '// No code loaded...';

    return (
      <div className="code-section">
        <div className="code-block">
          <Code codeString={codeString} language="javascript" />
        </div>
        {code && (
          <div className="code-actions">
            <div>
              <CopyToClipboard text={code}>
                <Button
                  color="green"
                  size="large"
                  content="Copy to Clipboard"
                />
              </CopyToClipboard>
              <Button
                color="green"
                size="large"
                content="Download File"
                onClick={this.download}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CodeBlock;
