'use client'

import { useEffect, useState } from "react";
import InteractiveMap from "./InteractiveMap";
import MissionParameterInput from "./MissionParamInput";
import MissionParams from "@/types/MissionParams";
import { getCoveragePathVertices } from "@/lib/coverage-planner";
import Vector2d from "@/types/Vector2d";
import CoveragePathPlan from "@/types/CoveragePathPlan";

export default function MissionPlanner() {

  const [regionVertices, setRegionVertices] = useState<Vector2d[] | undefined>(undefined)
  const [missionParams, setMissionParams] = useState<MissionParams | undefined>(undefined)
  const [coveragePathPlan, setPathVertices] = useState<CoveragePathPlan | undefined>(undefined)

  function handleUpdatedRegionVertices(newRegionVertices?: Vector2d[]) {
    if (newRegionVertices === undefined) {
      setMissionParams(undefined);
      setPathVertices(undefined);
    }

    setRegionVertices(newRegionVertices);
  }

  useEffect(() => {
    console.log("regionVertices", regionVertices)
    console.log("missionParams", missionParams);

    if (missionParams === undefined || regionVertices === undefined) {
      setPathVertices(undefined);
      return;
    };

    const coveragePathVertices = getCoveragePathVertices(
      regionVertices,
      missionParams.cruiseSpeedMetresPerSecond,
      missionParams.waterFlowHeadingDegrees,
      missionParams.altitudeMetres
    );

    setPathVertices(coveragePathVertices);
  }, [regionVertices, missionParams])

  return (
    <div className="full-screen-div">

      <InteractiveMap
        setRegionVertices={handleUpdatedRegionVertices}
        coveragePathVertices={coveragePathPlan?.vertices}
      />

      {regionVertices && <MissionParameterInput
        setMissionParams={setMissionParams}
        estimatedMissionTimeSeconds={coveragePathPlan?.estimatedMissionTimeSeconds}
        className="basis-1/4 p-10 mx-auto rounded-xl shadow-md space-y-8"
      />}
    </div>
  )
};