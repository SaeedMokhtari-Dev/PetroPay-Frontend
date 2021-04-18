import React from "react";
import "./Preloader.scss";
import Spinner from "./Spinner";

const Preloader = ({ caption = null, height = null, size = 20 }) => (
    <div className="preloader" style={{height: height}}>
        <Spinner size={size}/>
        <span style={{display: caption ? 'inline-block' : 'none'}} className="caption">{caption}</span>
    </div>
);

export default Preloader;