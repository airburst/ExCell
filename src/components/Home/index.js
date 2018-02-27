import { connect } from 'react-redux';
import Home from './Home';
import { setCode, setModel } from '../../actions';

const mapStateToProps = ({ settings }) => ({ settings });

const mapDispatchToProps = dispatch => ({
  setCode: code => dispatch(setCode(code)),
  setModel: func => dispatch(setModel(func)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Copy));
