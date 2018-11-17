import { firebase, auth } from "../firebase";
import { removeQueryStringFromUrl } from "../utils";

// Action creators
const USER_SUBSCRIBE = "USER_SUBSCRIBE";
export const userSubscribe = () => dispatch => {
  const handleAuthStateChange = user => {
    const href = window.location.href;

    // Confirm the link is a sign-in with email link.
    if (auth.isSignInWithEmailLink(href)) {
      let email = window.localStorage.getItem("emailForSignIn");

      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }

      // Construct the email link credential from the current URL.
      var credential = firebase.auth.EmailAuthProvider.credentialWithLink(
        email,
        href
      );

      // Link the credential to the current user.
      if (user) {
        user
          .linkAndRetrieveDataWithCredential(credential)
          .then(usercred => {
            // log.debug("usercred", usercred);
            window.localStorage.removeItem("emailForSignIn");
            dispatch(receiveUser(user));
            removeQueryStringFromUrl();
          })
          .catch(log.error);
      } else {
        auth
          .signInWithEmailLink(email, href)
          .then(result => {
            window.localStorage.removeItem("emailForSignIn");
            dispatch(receiveUser(user));
            removeQueryStringFromUrl();
          })
          .catch(err => {
            log.error(email, err);
          });
      }
    } else {
      dispatch(receiveUser(user));
    }
  };

  const unsubscribe = auth.onAuthStateChanged(handleAuthStateChange);
  dispatch({ type: USER_SUBSCRIBE, unsubscribe });
};

const RECEIVE_USER = "RECEIVE_USER";
export const receiveUser = user => ({
  type: RECEIVE_USER,
  user
});

const USER_UNSUBSCRIBE = "USER_UNSUBSCRIBE";
export const userUnsubscribe = () => ({ type: USER_UNSUBSCRIBE });

// Reducers
export default function reducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return action.user
        ? {
            subscribed: true,
            uid: action.user.uid,
            isAnonymous: action.user.isAnonymous,
            email: action.user.email
          }
        : { subscribed: true };
    case USER_UNSUBSCRIBE:
      return {};
    case USER_SUBSCRIBE:
    default:
      return state;
  }
}
