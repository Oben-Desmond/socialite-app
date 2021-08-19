import TimeAgo from 'javascript-time-ago'
import React from "react";
import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'
import ReactTimeAgo from 'react-time-ago'
import  "./styles/timeago.css";
TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

// @flow strict


function RTimeAgo({timestamp}){
    return (
        <div className={`time-ago`}>
            <ReactTimeAgo date={timestamp} locale="en-US"/>
        </div>
    );
};

export default RTimeAgo;