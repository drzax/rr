import { connect } from "react-redux";
import { requestLoginEmail, requestLogout } from "../../ducks/user";
import MainMenu from "./component";

const mapStateToProps = state => {
  const {
    user: { isAnonymous, email }
  } = state;
  return {
    isAnonymous,
    username: isAnonymous ? "Anonymous" : email
  };
};

const mapDispatchToProps = dispatch => ({
  handleLogin: email => dispatch(requestLoginEmail(email)),
  requestLogout: () => dispatch(requestLogout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainMenu);
