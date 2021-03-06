import merge from 'lodash/merge';
import {
  RECEIVE_CURRENT_USER,
  // RECEIVE_ERRORS
} from '../actions/session_actions';

// const nullUser = Object.freeze({
//   currentUser: null,
//   errors: []
// });

const SessionReducer = (state = {}, action) => {
  Object.freeze(state);
  switch(action.type)
  {
    case RECEIVE_CURRENT_USER:
      return merge({}, action.currentUser);
    default:
      return state;
  }
};

export default SessionReducer;
