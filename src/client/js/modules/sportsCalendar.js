export const EVENTS_LOADED = "sportsCalendar/EVENTS_LOADED";

const initialState = [];

export const saveLoadedEvents = (events) => {
    return {
        type: EVENTS_LOADED,
        payload: events
    };
}

export const remoteAction = (payload) => {
    return {
        type: REMOTE,
        payload: payload,
        meta: {
            remote: true
        }
    };
}

export default (state = initialState, action) => {
    if (EVENTS_LOADED === action.type) {
        state.events = action.payload.events;
    }
    return state;
}
