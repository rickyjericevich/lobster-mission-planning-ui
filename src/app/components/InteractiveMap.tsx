'use client'

import { ComponentPropsWithoutRef, useEffect, useRef } from 'react';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import MapboxDraw, { DrawCreateEvent, DrawDeleteEvent, DrawUpdateEvent } from '@mapbox/mapbox-gl-draw';
import Vector2d from '@/types/Vector2d';
import { GeoJSON } from 'geojson';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';


export interface InteractiveMapProps extends ComponentPropsWithoutRef<"div"> {
  setRegionVertices: (regionVertices?: Vector2d[]) => void;
  coveragePathVertices?: Vector2d[];
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


export default function InteractiveMap({ setRegionVertices, coveragePathVertices, ...props }: InteractiveMapProps) {

  const mapRef = useRef<mapboxgl.Map>()
  const mapContainerRef = useRef()

  function onRegionCreated(e: DrawCreateEvent) {
    disablePolygonButton(); // disable the polygon button to prevent the user form making more regions
    setRegionVertices(e.features[0].geometry.coordinates[0].map(Vector2d.fromArray))
  }

  function onRegionUpdated(e: DrawUpdateEvent) {
    setRegionVertices(e.features[0].geometry.coordinates[0]?.map(Vector2d.fromArray))
  }

  function onRegionDeleted(e: DrawDeleteEvent) {
    enablePolygonButton(); // enable the polygon button so that the user can make a new region
    setRegionVertices(undefined)
  }

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoicmlja3lqZXJpY2V2aWNoIiwiYSI6ImNtMXg5ejUwZDA0aDgybHM4Nm12bjB1MnYifQ.Kp6tSVlV-7ydF9M2KHBEVg' // WARNING: move to env file!

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

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    if (mapRef.current === undefined) return;

    if (coveragePathVertices) {
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

      mapRef.current.addSource('coverage-path', { type: 'geojson', data: sourceData });

      mapRef.current.addLayer({
        id: 'coverage-path',
        type: 'line',
        source: 'coverage-path',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#667eea', 'line-opacity': 0.5, 'line-width': 8 } // indigo-500
      });
    } else { // remove the path line
      const existingSource: GeoJSONSource | undefined = mapRef.current.getSource('coverage-path');
      if (existingSource) existingSource.setData({
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: [] }
      });
    }
  }, [coveragePathVertices])

  return (
    <div
      {...props}
      id='map-container'
      ref={mapContainerRef}
      className="full-screen-div"
    />
  )
};
