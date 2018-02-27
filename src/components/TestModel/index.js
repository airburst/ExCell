import { connect } from 'react-redux';
import TestModel from './TestModel';
// import { setCode, setModel } from '../../actions';

const mapStateToProps = ({ settings }) => ({ settings });

// const mapDispatchToProps = dispatch => ({
//   setCode: code => dispatch(setCode(code)),
//   setModel: func => dispatch(setModel(func)),
// });

export default connect(mapStateToProps, {})(TestModel);
