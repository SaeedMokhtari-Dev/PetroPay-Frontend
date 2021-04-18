import React from "react";

interface SpinnerProps {
    size: number;
    color?: string,
}

const Spinner: React.FC<SpinnerProps> = (props) =>
{
    return(
        <div className="spinner" style={{width: props.size, height: props.size, borderColor: props.color}}/>
    )
};

export default Spinner;