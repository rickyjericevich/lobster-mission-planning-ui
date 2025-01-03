'use client'

import { useEffect, useState } from "react";
import InteractiveMap from "./InteractiveMap";
import MissionParameterInput from "./MissionParamInput";
import MissionParams from "@/types/MissionParams";
import { getCoveragePathVertices } from "@/lib/coverage-planner";
import CoveragePathPlan from "@/types/CoveragePathPlan";
import { Feature, Polygon } from 'geojson';

export default function MissionPlanner() {

  const [regionVertices, setRegionVertices] = useState<Feature<Polygon> | undefined>(undefined)
  const [missionParams, setMissionParams] = useState<MissionParams | undefined>(undefined)
  const [coveragePathPlan, setPathVertices] = useState<CoveragePathPlan | undefined>(undefined)

  useEffect(() => {
    if (regionVertices === undefined) {
      setMissionParams(undefined);
      setPathVertices(undefined);
      return;
    };

    if (missionParams) {
      const coveragePathVertices = getCoveragePathVertices(
        regionVertices,
        missionParams.cruiseSpeedMetresPerSecond,
        missionParams.waterFlowHeadingDegrees,
        missionParams.altitudeMetres
      );

      setPathVertices(coveragePathVertices);
    }
  }, [regionVertices, missionParams])

  return (
    <div className="full-screen-div">

      <InteractiveMap
        setRegionVertices={setRegionVertices}
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