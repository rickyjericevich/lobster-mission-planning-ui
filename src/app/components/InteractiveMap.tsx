'use client'

import { ComponentPropsWithoutRef, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw, { DrawCreateEvent, DrawDeleteEvent, DrawUpdateEvent } from '@mapbox/mapbox-gl-draw';
import { Position } from 'geojson'

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

export interface InteractiveMapProps extends ComponentPropsWithoutRef<"div"> {
  setRegionCoords: (coords: Position[] | undefined) => void
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

export default function InteractiveMap({ setRegionCoords, ...props }: InteractiveMapProps) {

  const mapRef = useRef<mapboxgl.Map>()
  const mapContainerRef = useRef()

  function onRegionCreated(e: DrawCreateEvent) {
    console.log('onRegionCreated', e.features)
    // prevent user from making more regions
    disablePolygonButton(); // disable the polygon button
    setRegionCoords(e.features[0].geometry.coordinates[0])
  }

  function onRegionUpdated(e: DrawUpdateEvent) {
    console.log('onRegionUpdated', e.features)
    setRegionCoords(e.features[0].geometry.coordinates[0])
  }

  function onRegionDeleted(e: DrawDeleteEvent) {
    console.log('onRegionDeleted', e.features)
    // allow user to make a new region
    enablePolygonButton(); // enable the polygon button
    setRegionCoords(undefined)
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

    // https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#events
    mapRef.current.on('draw.create', onRegionCreated);
    mapRef.current.on('draw.update', onRegionUpdated);
    mapRef.current.on('draw.delete', onRegionDeleted);

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  return <div
    {...props}
    id='map-container'
    ref={mapContainerRef}
    className="h-full w-full"
  />
};