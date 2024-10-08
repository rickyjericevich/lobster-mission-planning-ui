import { ComponentPropsWithoutRef, useState } from "react";
import MissionParams from "@/types/MissionParams";

export interface MissionParameterInputProps extends ComponentPropsWithoutRef<"div"> {
    setMissionParams: (missionParams: MissionParams) => void;
}

export default function MissionParamaterInput({ setMissionParams, ...props }: MissionParameterInputProps) {
    const [cruiseSpeedMetresPerSecond, setCruiseSpeedMetresPerSecond] = useState(1);
    const [waterFlowHeadingDegrees, setWaterFlowAngleDegrees] = useState(0); // 0° is north, 90° is east etc
    const [altitudeMetres, setAltitude] = useState(2);

    function handleSubmit() {
        const missionParams: MissionParams = {
            cruiseSpeedMetresPerSecond,
            waterFlowHeadingDegrees,
            altitudeMetres
        };

        setMissionParams(missionParams);
    }


    return (
        <div {...props} className="p-6 mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-2xl font-bold mb-4">Mission Parameters</h1>

            <div className="space-y-2">
                <label className="block">
                    <span className="block font-medium text-gray-700">Altitude: {altitudeMetres} m</span>
                    <input
                        type="range"
                        min={0}
                        max={10}
                        step={0.1}
                        value={altitudeMetres}
                        onChange={(e) => setAltitude(Number(e.target.value))}
                        className="mt-1 block w-full text-sm p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </label>
            </div>

            <div className="space-y-2">
                <label className="block">
                    <span className="block font-medium text-gray-700">Cruise speed relative to sea bed: {cruiseSpeedMetresPerSecond.toFixed(1)} m/s</span>
                    <input
                        type="range"
                        min={0}
                        max={5}
                        step={0.1}
                        value={cruiseSpeedMetresPerSecond}
                        onChange={(e) => setCruiseSpeedMetresPerSecond(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </label>
            </div>

            <div className="space-y-2">
                <label className="block">
                    <span className="block font-medium text-gray-700">Water current heading: {waterFlowHeadingDegrees}°</span>
                    <input
                        type="range"
                        min={0}
                        max={360}
                        step={1}
                        value={waterFlowHeadingDegrees}
                        onChange={(e) => setWaterFlowAngleDegrees(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

            <button
                onClick={handleSubmit}
                className="w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-md shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Save
            </button>
        </div>
    );
}
