import { connect } from "react-redux";
import MainMenu from "./component";

const mapStateToProps = state => {
  const {
    user: { isAnonymous, email }
  } = state;
  return {
    username: isAnonymous ? "Anonymous" : email
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainMenu);
