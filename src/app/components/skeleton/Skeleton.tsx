import React from "react";
import "./Skeleton.scss"

const Skeleton  = ({
     count = 1,
     height = 30,
     width = null,
     active,
     className = null,
     children = null}) =>
{
    let skClassName = "skeleton " + (className ? className : '').trim();
    let skWidth = width ? `${width}px` : '100%';

    function getLines()
    {
        let list = [];

        for(let i = 0; i < count; i++)
        {
            list.push(i);
        }

        return list;
    }

    return(
        <React.Fragment>
            {active && (
                <div className={skClassName}>
                    {getLines().map(() =>
                    {
                        return (
                            <span className="item" style={{height: height, width: skWidth}} />
                        )
                    })}
                </div>
            )}
            {!active && children}
        </React.Fragment>
    );
};

export default Skeleton;