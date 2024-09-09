import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllImmobili, getAllImmobiliInZone } from "@/queries/immobili";
import { getAllZone } from "@/queries/zone";
import { immobile, zona_urbanistica } from "@/lib/definitions";
import MapView from '@/components/MapViewComponent';
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

export const SelectedZoneContext = createContext<string[]>([]);
export const ZoneContext = createContext<zona_urbanistica[]>([]);

const HomepageComponent: React.FC = () => {
    const [immobili, setImmobili] = useState<immobile[]>([]);
    const [page, setPage] = useState(1);
    const [visibleImmobili, setVisibleImmobili] = useState<immobile[]>([]);
    const [slicedImmobili, setSlicedImmobili] = useState<immobile[]>([]);
    const [selectedZone, setSelectedZone] = useState<string[]>([]);
    const [mapView, setMapView] = useState<JSX.Element>();
    const searchParams = useContext(SearchParamsContext);

    let element_per_page = 10;

    useEffect(() => {
        if (!searchParams) return;
        const selected_zone_param = searchParams.getAll('zona') as string | string[] ;
        const local_selected_zone = Array.isArray(selected_zone_param) ? selected_zone_param : [selected_zone_param].filter(Boolean);
        setSelectedZone(local_selected_zone);
        const fetchImmobili = local_selected_zone.length > 0 ? getAllImmobiliInZone : getAllImmobili;
        fetchImmobili(local_selected_zone).then(setImmobili).catch(console.error);
    }, [searchParams]);

    useEffect(() => {
        setMapView(
            <MapView
                immobili={immobili}
                visibleImmobili={visibleImmobili}
                slicedImmobili={slicedImmobili}
                page={page}
                setPage={setPage}
                setVisibleImmobili={setVisibleImmobili}
                element_per_page={element_per_page}
            />
        );
    }, [immobili, page, selectedZone, slicedImmobili, visibleImmobili]);

    useEffect(() => {
        setPage(1);
        setSlicedImmobili(visibleImmobili.length > element_per_page ? visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page) : visibleImmobili);
    }, [visibleImmobili]);

    useEffect(() => {
        setSlicedImmobili(visibleImmobili.length > element_per_page ? visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page) : visibleImmobili);
    }, [page]);

    return (
        <SelectedZoneContext.Provider value={selectedZone}>
            {mapView}
        </SelectedZoneContext.Provider>
    );
};

export default HomepageComponent;