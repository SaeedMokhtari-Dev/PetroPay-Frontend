import React from "react";
import "./Skeleton.scss"

const SkeletonCircle  = ({ size= 32, active, className = null, children = null}) =>
{
    let skClassName = "skeleton skeleton-circle " + (className ? className : '').trim();
    let radius = size / 2;

    return(
        <React.Fragment>
            {active && (
                <div className={skClassName}>
                    <span className="item" style={{height: size, width: size, borderRadius: radius}} />
                </div>
            )}
            {!active && children}
        </React.Fragment>
    );
};

export default SkeletonCircle;