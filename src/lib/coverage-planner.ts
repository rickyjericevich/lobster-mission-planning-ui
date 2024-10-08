import Vector2d from "@/types/Vector2d";
import Line2d from "@/types/Line2d";
import LineSegment2d from "@/types/LineSegment2d";
import Area from "@/types/Area";
import CoveragePathPlan from "@/types/CoveragePathPlan";

function toRadians(degrees: number) {
    return degrees * Math.PI / 180;
}

// https://www.movable-type.co.uk/scripts/latlong.html
function offsetLongLatByDistance(distanceMetres: number, referenceLatitudeDegrees: number, earth_radius = 6371e3): number {
    // assumes distance is small enough that the earth is flat
    // https://gis.stackexchange.com/questions/2951/algorithm-for-offsetting-a-latitude-longitude-by-some-amount-of-meters
    // TODO: improve this approximation
    return distanceMetres / 111_111 * Math.sqrt(1 + Math.cos(toRadians(referenceLatitudeDegrees)) ** 2);
}

function longLatToMetres(coord1: Vector2d, coord2: Vector2d, earth_radius = 6371e3): number {
    // haversine formula
    const dLat = toRadians(coord2.y) - toRadians(coord1.y);
    const dLon = toRadians(coord2.x) - toRadians(coord1.x);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(coord1.y)) * Math.cos(toRadians(coord2.y)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return earth_radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// rearrange vertices such that the vertex fuRthest to the left is the first element
function getFurthestLeftVertexIndex(vertices: Vector2d[]): number {
    let furthestLeftIndex = 0;
    let furthestLeftX = vertices[0].x;
    for (let i = 1; i < vertices.length; i++) {
        if (vertices[i].x < furthestLeftX) {
            furthestLeftX = vertices[i].x;
            furthestLeftIndex = i;
        }
    }
    return furthestLeftIndex;
}

function putFurthestLeftVertexFirst(vertices: Vector2d[]): Vector2d[] {
    const i = getFurthestLeftVertexIndex(vertices);
    const before = vertices.slice(0, i + 1);
    const after = vertices.slice(i + 1);
    return before.concat(after);
}

function getScanArea(altitudeMetres: number): Area {
    const length = 1.5 * altitudeMetres; // TODO: don't hardcode 1.5
    return { length, width: length };
}

export function getCoveragePathVertices(polygonVertices: Vector2d[], cruiseSpeedMetresPerSecond: number, waterFlowHeadingDegrees: number, altitudeMetres: number) {
    if (polygonVertices[0] === polygonVertices[polygonVertices.length - 1]) polygonVertices.pop(); // remove last vertex if it's the same as the first
    polygonVertices = putFurthestLeftVertexFirst(polygonVertices); // put the vertex furthest to the left first. This will be the robot's starting point

    const flowAngle = toRadians(waterFlowHeadingDegrees); // define angle as positive when measured to the right of the vertical
    const flowDirectionVector = new Vector2d(Math.sin(flowAngle), Math.cos(flowAngle)); // unit vector in the direction of the flow
    const flowLineThruFirstVertex = new Line2d(polygonVertices[0], flowDirectionVector);

    const scanArea = getScanArea(altitudeMetres);
    const scanWidthLongLatUnits = offsetLongLatByDistance(scanArea.width, polygonVertices[0].y);

    const polygonEdges = polygonVertices.map((vertex, i) => new LineSegment2d(vertex, polygonVertices[(i + 1) % polygonVertices.length]));

    // sweep through the polygon in the direction perpendicular to the flow by a step distance of scanWidthLongLatUnits
    // at each step, find the intersections between the path line (which is in the direction of the flow) and the polygon edges

    const all_intersections = [];

    const firstPathLine = flowLineThruFirstVertex.parallel_line_at_distance(scanWidthLongLatUnits / 2); // half the scan width away from the first vertex

    let pathLine = firstPathLine
    while (true) { // look for intersections in the initial direction
        const intersections = polygonEdges.map(segment => pathLine.intersection(segment)).filter(intersection => intersection !== undefined);
        if (intersections.length === 0) break; // there are no more intersections in the initial direction
        all_intersections.push(intersections);
        pathLine = pathLine.parallel_line_at_distance(scanWidthLongLatUnits); // move stepDistance in the initial direction
    }

    pathLine = firstPathLine.parallel_line_at_distance(-scanWidthLongLatUnits);
    while (true) { // look for intersections in the other direction
        const intersections = polygonEdges.map(segment => pathLine.intersection(segment)).filter(intersection => intersection !== undefined);
        if (intersections.length === 0) break; // there are no more intersections in the other direction
        all_intersections.unshift(intersections); // since we are moving in the other direction, we must prepend these intersections so that the final array of intersections is in the correct order
        pathLine = pathLine.parallel_line_at_distance(-scanWidthLongLatUnits); // move in the other direction
    }

    // all the segments in all_intersections point in the same direction (same as flow direction), but to create a path from these segments, we need to alternate the direction of the segments
    // we can do this by reversing the direction of every other segment
    const pathVertices = all_intersections.map((intersections, i) => {
        if (i % 2 === 0) return intersections;
        return intersections.reverse();
    }).flat();

    // TODO: we must determine which direction of the path is the most energy efficient given the water flowAngle
    //  we can do this by calculating the total work done by an object that traverses the path
    // the work done on each segment is proportional to the dot product of the segment and the flow direction
    // the total work done is the sum of the work done on each segment

    // calculate the time taken to traverse the path
    const totalTime = pathVertices.reduce((totalTime, vertex, i) => {
        if (i === 0) return totalTime;
        return totalTime + longLatToMetres(vertex, pathVertices[i - 1]) / cruiseSpeedMetresPerSecond;
    }, 0);

    const pathPlan: CoveragePathPlan = {
        vertices: pathVertices,
        estimatedMissionTimeSeconds: totalTime
    }
    
    return pathPlan;
}
