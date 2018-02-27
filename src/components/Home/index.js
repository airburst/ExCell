import { connect } from 'react-redux';
import Home from './Home';
import { setCode } from '../../actions';

const mapStateToProps = ({ settings }) => ({ settings });

const mapDispatchToProps = dispatch => ({
  setCode: code => dispatch(setCode(code)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Copy));
