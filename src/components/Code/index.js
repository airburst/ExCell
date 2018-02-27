import { connect } from 'react-redux';
import Code from './Code';

const mapStateToProps = ({ settings }) => ({ settings });

export default connect(mapStateToProps, {})(Code);
