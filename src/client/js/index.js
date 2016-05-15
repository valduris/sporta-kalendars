import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import SportsCalendar from "./components/SportsCalendar";
import sportsCalendar from "./modules/sportsCalendar";

const ajax = {
    send: () => {}
};

function remoteMiddleware() {
    return next => action => {
        if (action.meta && action.meta.remote === true) {
            ajax.send(action);
        } else {
            return next(action);
        }
    };
}

const store = createStore(sportsCalendar, applyMiddleware(remoteMiddleware));

ReactDOM.render(
    <Provider store={store}>
        <SportsCalendar />
    </Provider>,
    document.querySelector("#root")
);

window.store = store;
