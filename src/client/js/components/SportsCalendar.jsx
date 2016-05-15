import React from "react";
import { connect } from "react-redux";

import FullCalendar from "./FullCalendar";

require("./sports-calendar.styl");


class SportsCalendar extends React.Component {
    render() {
        return (
            <div className="wrapper">
                <div className="top-navigation">
                </div>
                <div className="main-content">
                    <h1>Sports Calendar</h1>
                    <FullCalendar />
                </div>
                <div className="footer">
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(SportsCalendar);
