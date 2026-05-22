import CircleProgress from "../../../components/CircleProgress";
import { ringProgressColor } from "../utils/processTypeColors";

type Props = {
    value: number;
    stroke?: number;
};


export default function ProcessProgressRing({ value, stroke = 8 }: Props) {
    const color = ringProgressColor(value);

    return (
        <CircleProgress
            progress={value}
            stroke={stroke}
            color={color}
            radius={35}
            strokeStyle="round"
        >
            <div className="w-100 flex-grow-1" style={{ color }}>
                <div className="fw-bold">
                    {value || 0}%
                </div>
            </div>
        </CircleProgress>
    );
}
