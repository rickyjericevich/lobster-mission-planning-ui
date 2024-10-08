'use client'

import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import MapboxDraw, { DrawCreateEvent, DrawDeleteEvent, DrawUpdateEvent } from '@mapbox/mapbox-gl-draw';
import Vector2d from '@/types/Vector2d';
import MissionParams from "@/types/MissionParams";
import MissionParamaterInput from "./MissionParamInput";
import { GeoJSON } from 'geojson';
import { getCoveragePathVertices } from "@/lib/coverage-planner";

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';


export interface InteractiveMapProps extends ComponentPropsWithoutRef<"div"> {
}


function enablePolygonButton() {
  togglePolygonButton(false);
}


function disablePolygonButton() {
  togglePolygonButton(true);
}


function togglePolygonButton(disable: boolean) {
  const polygonBtn = document.getElementsByClassName('mapbox-gl-draw_polygon')[0] as HTMLButtonElement;
  polygonBtn.disabled = disable;
}


export default function InteractiveMap({ ...props }: InteractiveMapProps) {

  const mapRef = useRef<mapboxgl.Map>()
  const mapContainerRef = useRef()

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
      console.log("removing coverage path from map")

      if (mapRef.current !== undefined) {
        mapRef.current.removeLayer('coverage-path');
        mapRef.current.removeSource('coverage-path');
      }

      return;
    };

    const coveragePathVertices = getCoveragePathVertices(regionVertices, missionParams.waterFlowHeadingDegrees, missionParams.altitudeMetres);
    console.log("Path vertices " + coveragePathVertices);
    setPathVertices(coveragePathVertices);
  }, [regionVertices, missionParams])

  useEffect(() => {
    if (mapRef.current === undefined) return;

    if (coveragePathVertices) {
      console.log("adding coverage path to map")

      const sourceData: GeoJSON = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coveragePathVertices.map(v => v.toArray())
        }
      }

      const existingSource: GeoJSONSource | undefined = mapRef.current.getSource('coverage-path');
      if (existingSource) {
        existingSource.setData(sourceData);
        return;
      }

      mapRef.current.addSource('coverage-path', {
        type: 'geojson',
        data: sourceData,
      });

      mapRef.current.addLayer({
        id: 'coverage-path',
        type: 'line',
        source: 'coverage-path',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#000',
          'line-width': 8
        }
      });
    }
  }, [coveragePathVertices])

  function onRegionCreated(e: DrawCreateEvent) {
    disablePolygonButton(); // disable the polygon button to prevent the user form making more regions
    handleUpdatedRegionVertices(e.features[0].geometry.coordinates[0].map(Vector2d.fromArray))
  }

  function onRegionUpdated(e: DrawUpdateEvent) {
    handleUpdatedRegionVertices(e.features[0].geometry.coordinates[0].map(Vector2d.fromArray))
  }

  function onRegionDeleted(e: DrawDeleteEvent) {
    enablePolygonButton(); // enable the polygon button so that the user can make a new region
    handleUpdatedRegionVertices(undefined)
  }

  function onMapRotated() {
    console.log('onMapRotated')
  }

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoicmlja3lqZXJpY2V2aWNoIiwiYSI6ImNtMXg5ejUwZDA0aDgybHM4Nm12bjB1MnYifQ.Kp6tSVlV-7ydF9M2KHBEVg'

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon'
    });

    mapRef.current.addControl(draw, 'top-left');
    mapRef.current.addControl(new mapboxgl.GeolocateControl(), 'top-left'); // https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol
    mapRef.current.addControl(new mapboxgl.ScaleControl());
    mapRef.current.addControl(new mapboxgl.NavigationControl());

    // https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#events
    mapRef.current.on('draw.create', onRegionCreated);
    mapRef.current.on('draw.update', onRegionUpdated);
    mapRef.current.on('draw.delete', onRegionDeleted);

    mapRef.current.on('rotatestart', onMapRotated);

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  return (
    <div className="h-full w-full flex flex-row">
      <div
        {...props}
        id='map-container'
        ref={mapContainerRef}
        className="h-full w-full"
      />
      {regionVertices && <MissionParamaterInput setMissionParams={setMissionParams} className="basis-1/4" />}
    </div>
  )
};
