/**
 * Created by Justin on 2016-02-29.
 */
import React, {
  Component,
  PropTypes
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Main from '../components/Main';

class App extends Component {
  render() {
    return (
      <Main {...this.props}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    menu: state.menu,
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {

  };

  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
