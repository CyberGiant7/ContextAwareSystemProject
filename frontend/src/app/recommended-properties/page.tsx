"use client";
import React, {useContext, useEffect, useState} from 'react';
import {
    ImmobiliContext,
    SelectedZoneContext,
    SortedByContext,
    VisibleImmobiliContext
} from "@/components/wrapper/DataWrapper";
import {immobile} from "@/lib/definitions";
import MapView from "@/components/MapViewComponent";


export default function App() {
    const immobili = useContext(ImmobiliContext);
    const [selectedZone, setSelectedZone] = useContext(SelectedZoneContext);
    const [visibleImmobili, setVisibleImmobili] = useContext(VisibleImmobiliContext)
    const [sortedBy, setSortedBy] = useContext(SortedByContext);

    const [slicedImmobili, setSlicedImmobili] = useState<immobile[]>([]);

    const [page, setPage] = useState(1);
    const [mapView, setMapView] = useState<JSX.Element>();

    useEffect(() => {
        setSortedBy("rank");
    }, []);

    let element_per_page = 10;
    useEffect(() => {
        setPage(1);
        setSlicedImmobili(visibleImmobili.length > element_per_page ? visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page) : visibleImmobili);
    }, [visibleImmobili]);

    useEffect(() => {
        setSlicedImmobili(visibleImmobili.length > element_per_page ? visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page) : visibleImmobili);
    }, [page]);


    useEffect(() => {
        setMapView(
            <MapView
                slicedImmobili={slicedImmobili}
                page={page}
                setPage={setPage}
                element_per_page={element_per_page}
            />
        );
    }, [immobili, page, selectedZone, slicedImmobili]);


    return (
        <div className="App">
            {mapView}
        </div>
    );
}