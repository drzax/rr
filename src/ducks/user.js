import { firebase, auth } from "../firebase";
import { removeQueryStringFromUrl } from "../utils";
import { showNotification } from "./notifications";
import * as log from "loglevel";

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

const REQUEST_LOGIN_EMAIL = "REQUEST_LOGIN_EMAIL";
const LOGIN_EMAIL_SENT = "LOGIN_EMAIL_SENT";
export const requestLoginEmail = email => dispatch => {
  dispatch({ type: REQUEST_LOGIN_EMAIL, email });
  dispatch(showNotification("Sending login email"));
  auth
    .sendSignInLinkToEmail(email, {
      url: window.location.href,
      handleCodeInApp: true
    })
    .then(() => {
      window.localStorage.setItem("emailForSignIn", email);
      dispatch({ type: LOGIN_EMAIL_SENT, email });
      dispatch(showNotification("Please check your email for a sign-in link"));
    })
    .catch(log.error);
};

const REQUEST_LOGIN_ANON = "REQUEST_LOGIN_ANON";
const ANONYMOUS_USER_CREATED = "ANONYMOUS_USER_CREATED";
export const requestLoginAnon = () => dispatch => {
  dispatch({ type: REQUEST_LOGIN_ANON });
  dispatch(showNotification("Hold tight, creating your anonymous account"));
  auth
    .signInAnonymously()
    .then(() => {
      dispatch({ type: ANONYMOUS_USER_CREATED });
      dispatch(
        showNotification(
          "Anonymous account created. Sign up to make it permanent."
        )
      );
    })
    .catch(log.error);
};

const USER_UNSUBSCRIBE = "USER_UNSUBSCRIBE";
export const userUnsubscribe = () => ({ type: USER_UNSUBSCRIBE });

const REQUEST_LOGOUT = "REQUEST_LOGOUT";
const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const requestLogout = () => dispatch => {
  dispatch({ type: REQUEST_LOGOUT });
  auth
    .signOut()
    .then(() => {
      dispatch({ type: LOGOUT_SUCCESS });
      dispatch(showNotification("You are logged out!"));
    })
    .catch(log.error);
};

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
