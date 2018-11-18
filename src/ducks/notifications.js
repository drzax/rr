const SHOW_NOTIFICATION = "SHOW_NOTIFICATION";
export const showNotification = (message, duration = 6000) => ({
  type: SHOW_NOTIFICATION,
  message,
  duration
});

const CLOSE_NOTIFICATION = "CLOSE_NOTIFICATION";
export const closeNotification = () => ({
  type: CLOSE_NOTIFICATION
});

export default function reducer(state = { isOpen: false }, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return { isOpen: true, ...action };
    case CLOSE_NOTIFICATION:
      return { ...state, isOpen: false };
    default:
      return state;
  }
}
