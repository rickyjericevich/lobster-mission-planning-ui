'use client'

import { useEffect, useState } from "react";
import InteractiveMap from "./InteractiveMap";
import MissionParamaterInput from "./MissionParamInput";
import MissionParams from "@/types/MissionParams";
import { getCoveragePathVertices } from "@/lib/coverage-planner";
import Vector2d from "@/types/Vector2d";

export default function MissionPlanner() {

    const [regionVertices, setRegionVertices] = useState<Vector2d[] | undefined>(undefined)
    const [missionParams, setMissionParams] = useState<MissionParams | undefined>(undefined)
    const [coveragePathVertices, setPathVertices] = useState<Vector2d[] | undefined>(undefined)

    function handleUpdatedRegionVertices(regionVertices?: Vector2d[]) {
        if (regionVertices === undefined) {
          setMissionParams(undefined);
          setPathVertices(undefined);
          return;
        }
    
        setRegionVertices(regionVertices);
      }

      useEffect(() => {
        console.log("regionVertices", regionVertices)
        console.log("missionParams", missionParams);
    
        if (missionParams === undefined || regionVertices === undefined) {
          setPathVertices(undefined);    
          return;
        };
    
        const coveragePathVertices = getCoveragePathVertices(regionVertices, missionParams.waterFlowHeadingDegrees, missionParams.altitudeMetres);
        console.log("Path vertices " + coveragePathVertices);
        setPathVertices(coveragePathVertices);
      }, [regionVertices, missionParams])

    return (
        <div className="h-full w-full flex flex-row">
            <InteractiveMap setRegionVertices={handleUpdatedRegionVertices} coveragePathVertices={coveragePathVertices} />
            {regionVertices && <MissionParamaterInput setMissionParams={setMissionParams} className="basis-1/4" />}
        </div>
    )
};