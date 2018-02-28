import { connect } from 'react-redux';
import Main from './Main';

const mapStateToProps = ({ settings }) => ({ settings });

// const mapDispatchToProps = dispatch => ({
//   setCode: code => dispatch(setCode(code)),
//   setModel: func => dispatch(setModel(func)),
// });

export default connect(mapStateToProps, {})(Main);
