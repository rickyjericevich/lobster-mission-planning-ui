'use client'

import { useEffect, useState } from "react";
import InteractiveMap from "./InteractiveMap";
import { Position } from 'geojson'
import MissionParamaterInput from "./MissionParamInput";
import MissionParams from "@/types/MissionParams";

export default function MissionPlanner() {

    const [regionCoords, setRegionCoords] = useState<Position[] | undefined>(undefined)
    const [missionParams, setMissionParams] = useState<MissionParams | undefined>(undefined)

    function generateCoveragePlanPath(coords: Position[] | undefined) {
        console.log("coords2", coords)

        setRegionCoords(coords)
    }

    useEffect(() => {
        console.log("missionParams", missionParams)
    }, [missionParams])

    return (
        <div className="h-full w-full flex flex-row">
            <InteractiveMap setRegionCoords={generateCoveragePlanPath} />
            {regionCoords && <MissionParamaterInput setMissionParams={setMissionParams} className="basis-1/4" />}
        </div>
    )
};