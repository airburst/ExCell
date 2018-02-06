import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

const InfoTableRow = props => {
  const listContent = content => content.map((c, key) => (
    <div key={key}>{c}</div>
  ));

  return (
    <Table.Body>
      <Table.Row>
        <Table.Cell>{listContent(props.content)}</Table.Cell>
      </Table.Row>
    </Table.Body>
  )
};

InfoTableRow.propTypes = {
  content: PropTypes.array,
};

const InfoTable = props => {
  const { title, content } = props;

  return (
    <div className="info-table">
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              {title}
              {content.length > 0 &&
                <div className="info-table-count">{content.length}</div>}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <InfoTableRow content={content} />
      </Table>
    </div>
  );
};

InfoTable.propTypes = {
  title: PropTypes.string,
  content: PropTypes.array,
};

export default InfoTable;
