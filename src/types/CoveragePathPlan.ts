import Vector2d from "./Vector2d";

type CoveragePathPlan = {
    vertices: Vector2d[];
    estimatedMissionTimeSeconds: number;
};

export default CoveragePathPlan;