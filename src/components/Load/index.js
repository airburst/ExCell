import { connect } from 'react-redux';
import Load from './Load';
import { setCode, setModel } from '../../actions';

const mapStateToProps = ({ settings }) => ({ settings });

const mapDispatchToProps = dispatch => ({
  setCode: code => dispatch(setCode(code)),
  setModel: func => dispatch(setModel(func)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Load);
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Copy));
