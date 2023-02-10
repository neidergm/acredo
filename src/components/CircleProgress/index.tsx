import style from './style.module.css';

type T_Props = {
    radius: number,
    progress: number,
    stroke: number,
    content: any,
    color?: string,
}

export const CircleProgress = (props: T_Props) => {

    const { radius, stroke, progress, content } = props;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const strokeDashoffset = circumference - progress / 100 * circumference;
    const color = props.color || "var(--progress-circle-color)";
    return (
        <div className={style["circleprogress-container"]} style={{ width: `${radius * 2}px` }}>
            <div className={style["content-text"]}>{content}</div>
            <svg
                height={radius * 2}
                width={radius * 2}
            >
                <circle
                    stroke={color}
                    className={style["circle"]}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset: 0, opacity: "0.2" }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={color}
                    className={style["circle"]}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
        </div>
    )
}

export default CircleProgress