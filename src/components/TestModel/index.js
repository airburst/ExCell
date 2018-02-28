import { connect } from 'react-redux';
import TestModel from './TestModel';
import { setTiming } from '../../actions';

const mapStateToProps = ({ settings }) => ({ settings });

const mapDispatchToProps = dispatch => ({
  setTiming: time => dispatch(setTiming(time)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TestModel);
