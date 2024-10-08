import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import MissionParams from "@/types/MissionParams";

export interface MissionParameterInputProps extends ComponentPropsWithoutRef<"div"> {
    setMissionParams: (missionParams: MissionParams) => void;
    estimatedMissionTimeSeconds?: number;
}

export default function MissionParameterInput({ setMissionParams, estimatedMissionTimeSeconds, ...props }: MissionParameterInputProps) {
    const [cruiseSpeedMetresPerSecond, setCruiseSpeedMetresPerSecond] = useState(1);
    const [waterFlowHeadingDegrees, setWaterFlowAngleDegrees] = useState(0); // 0° is north, 90° is east etc
    const [altitudeMetres, setAltitude] = useState(2);
    const [isModified, setIsModified] = useState(false);

    function handleSubmit() {
        const missionParams: MissionParams = {
            cruiseSpeedMetresPerSecond,
            waterFlowHeadingDegrees,
            altitudeMetres
        };

        setMissionParams(missionParams);
        setIsModified(false); // hide the save button after the user has saved the parameters
    }

    function formatTime(seconds: number | undefined): string {
        console.log("seconds", seconds);
        if (seconds === undefined) return 'N/A';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return [
            hours > 0 ? `${hours}h` : null,
            minutes > 0 ? `${minutes}m` : null,
            `${remainingSeconds.toFixed(0)}s`
        ].filter(Boolean).join(' ');
    }

    useEffect(() => {
        if (!isModified) setIsModified(true); // show the save button if the user has changed any of the parameters
    }, [cruiseSpeedMetresPerSecond, waterFlowHeadingDegrees, altitudeMetres]);

    return (
        <div {...props}>
            <h1 className="text-2xl font-bold mb-4">Mission Parameters</h1>

            <div className="text-lg font-medium text-gray-700">
                <h2 className="font-bold">Estimated Mission Time:</h2>
                <span>{formatTime(estimatedMissionTimeSeconds)}</span>
            </div>

            <div className="space-y-2">
                <label>
                    <span>Altitude: {altitudeMetres} m</span>
                    <input
                        type="range"
                        min={0}
                        max={10}
                        step={0.1}
                        value={altitudeMetres}
                        onChange={(e) => setAltitude(Number(e.target.value))}
                        required
                    />
                </label>
            </div>

            <div className="space-y-2">
                <label>
                    <span >Cruise speed relative to sea bed: {cruiseSpeedMetresPerSecond.toFixed(1)} m/s</span>
                    <input
                        type="range"
                        min={0}
                        max={5}
                        step={0.1}
                        value={cruiseSpeedMetresPerSecond}
                        onChange={(e) => setCruiseSpeedMetresPerSecond(Number(e.target.value))}
                    />
                </label>
            </div>

            <div className="space-y-2">
                <label>
                    <span>Water current heading: {waterFlowHeadingDegrees}°</span>
                    <input
                        type="range"
                        min={0}
                        max={360}
                        step={1}
                        value={waterFlowHeadingDegrees}
                        onChange={(e) => setWaterFlowAngleDegrees(Number(e.target.value))}
                    />
                    <div className="mt-2 flex justify-center items-center">
                        <div
                            className="h-32 w-32 rounded-full border-4 border-indigo-500 flex justify-center items-center relative"
                            style={{ transform: `rotate(${waterFlowHeadingDegrees}deg)` }}
                        >
                            <div className="absolute h-3 w-3 bg-indigo-500 rounded-full top-0"></div>
                        </div>
                    </div>
                </label>
            </div>

            {isModified && (
                <button
                    onClick={handleSubmit}
                    className="w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-md shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Save
                </button>
            )}
        </div>
    );
}
