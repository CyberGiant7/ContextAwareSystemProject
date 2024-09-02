// frontend/src/app/page.tsx
"use client";
import React, {useEffect, useState} from 'react';

import {getAllImmobili, getAllImmobiliInZone} from "@/queries/immobili";
import {getAllZone} from "@/queries/zone";
import {immobile, zona_urbanistica} from "@/lib/definitions";
import MapView from '@/components/MapViewComponent';


type SearchParams = {
    zona?: string | string[];
};

type Props = {
    searchParams: SearchParams;
};

export default function App({searchParams}: Props) {
    const [immobili, setImmobili] = useState<immobile[]>([]);
    const [page, setPage] = useState(1);
    const [visibleImmobili, setVisibleImmobili] = useState<immobile[]>([]);
    const [slicedImmobili, setSlicedImmobili] = useState<immobile[]>([]);
    const [activeZoneSelector, setActiveZoneSelector] = useState(false);
    const [selectedZone, setSelectedZone] = useState<string[]>([]);
    const [zone, setZone] = useState<zona_urbanistica[]>([]);
    const [mapView, setMapView] = useState<JSX.Element>();

    useEffect(() => {
        getAllZone().then(setZone).catch(console.error);
    }, []);

    useEffect(() => {
        let selected_zone_param = searchParams['zona'] as string | string[] | undefined;
        let local_selected_zone: string[] = [];
        if (selected_zone_param instanceof Array) {
            local_selected_zone = selected_zone_param;
            setSelectedZone(selected_zone_param);
        } else if (typeof selected_zone_param === "string") {
            local_selected_zone = [selected_zone_param];
            setSelectedZone([selected_zone_param]);
        }
        if (local_selected_zone.length > 0) {
            getAllImmobiliInZone(local_selected_zone).then(setImmobili).catch(console.error);
        } else {
            getAllImmobili().then(setImmobili).catch(console.error);
        }
    }, [searchParams]);

    useEffect(() => {
        setMapView(
            <MapView
                immobili={immobili}
                visibleImmobili={visibleImmobili}
                slicedImmobili={slicedImmobili}
                page={page}
                setPage={setPage}
                setActiveZoneSelector={setActiveZoneSelector}
                setVisibleImmobili={setVisibleImmobili}
                selectedZone={selectedZone}
            />)
        console.log("selectedZone", selectedZone);
    }, [immobili, page, selectedZone, slicedImmobili, visibleImmobili]);

    useEffect(() => {
        setPage(1);
        if (visibleImmobili.length > 10) {
            setSlicedImmobili(visibleImmobili.slice((page - 1) * 10, page * 10));
        } else {
            setSlicedImmobili(visibleImmobili);
        }
    }, [visibleImmobili]);

    useEffect(() => {
        if (visibleImmobili.length > 10) {
            setSlicedImmobili(visibleImmobili.slice((page - 1) * 10, page * 10));
        } else {
            setSlicedImmobili(visibleImmobili);
        }
    }, [page]);

    return (
        <div className="App">
            {mapView}
        </div>
    );
}