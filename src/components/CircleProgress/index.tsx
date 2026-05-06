import type { ReactElement } from 'react';
import style from './style.module.css';

type T_Props = {
    radius: number,
    progress: number,
    stroke?: number,
    children?: string | null | ReactElement | ReactElement[],
    padding?: number,
    margin?: number,
    color?: string,
    strokeStyle?: "round" | "butt" | "square" | "inherit",
}

export const CircleProgress = (props: T_Props) => {

    const { children, radius: _radius = 10, stroke = 10, progress, padding = 0, margin = 0 } = props;
    let { strokeStyle = "butt" } = props;
    let strokeDashoffset = 0;

    const color = props.color || "var(--progress-circle-color)";
    // const size = (_radius + padding) * 2;
    const size = (_radius) * 2;
    const halfSize = size / 2;
    const radius = (size - stroke - padding) / 2;
    const circumference = radius * Math.PI * 2;

    let dash = (progress * circumference) / 100;

    if (["round", "square"].includes(strokeStyle)) {
        if (progress < 100) {
            strokeDashoffset -= stroke / 2;
            dash -= stroke
        }

        if (dash < 0) {
            strokeStyle = "butt";
            dash = progress
        }
    }

    const circleProps = {
        stroke: color,
        strokeWidth: stroke,
        cx: halfSize,
        cy: halfSize,
        r: radius
    }

    return (
        <div className={style.container}>
            <div className={style.content}>{children}</div>
            <svg
                height={size}
                width={size}
                viewBox={`0 0 ${size} ${size}`}
            >
                <circle {...circleProps} />
                <circle
                    {...circleProps}
                    strokeWidth={circleProps.strokeWidth + padding - margin}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap={strokeStyle}
                    strokeDasharray={`${dash} ${circumference - dash}`}
                />
            </svg>
        </div>
    )
}

export default CircleProgress