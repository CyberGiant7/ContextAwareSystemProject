import React, {createContext, useContext, useEffect, useState} from 'react';
import {getAllImmobili, getAllImmobiliInZone} from "@/queries/immobili";
import {getAllZone} from "@/queries/zone";
import {immobile, zona_urbanistica} from "@/lib/definitions";
import MapView from '@/components/MapViewComponent';
import {SearchParamsContext} from "next/dist/shared/lib/hooks-client-context.shared-runtime";

export const SelectedZoneContext = createContext<string[]>([]);
export const ImmobiliContext = createContext<immobile[]>([]);
export const VisibleImmobiliContext = createContext<[immobile[], React.Dispatch<React.SetStateAction<immobile[]>>]>([[], () => {
}]);
export const ZoneContext = createContext<zona_urbanistica[]>([]);

const HomepageComponent: React.FC = () => {
    const [immobili, setImmobili] = useState<immobile[]>([]);
    const [page, setPage] = useState(1);
    const [visibleImmobili, setVisibleImmobili] = useState<immobile[]>([]);
    const [slicedImmobili, setSlicedImmobili] = useState<immobile[]>([]);
    const [mapView, setMapView] = useState<JSX.Element>();

    const searchParams = useContext(SearchParamsContext);
    const selected_zone_param = searchParams?.getAll('zona') as string | string[];
    const [selectedZone, setSelectedZone] = useState<string[]>(Array.isArray(selected_zone_param) ? selected_zone_param : [selected_zone_param].filter(Boolean));

    let element_per_page = 10;

    // useEffect(() => {
    //     // if (!searchParams) return;
    //     // const selected_zone_param = searchParams.getAll('zona') as string | string[] ;
    //     // setSelectedZone(Array.isArray(selected_zone_param) ? selected_zone_param : [selected_zone_param].filter(Boolean))
    //     // const local_selected_zone = Array.isArray(selected_zone_param) ? selected_zone_param : [selected_zone_param].filter(Boolean);
    //     // setSelectedZone(local_selected_zone);
    //     // const fetchImmobili = local_selected_zone.length > 0 ? getAllImmobiliInZone : getAllImmobili;
    //     // fetchImmobili(local_selected_zone).then(setImmobili).catch(console.error);
    // }, [searchParams]);

    useEffect(() => {
        const fetchImmobili = selectedZone.length > 0 ? getAllImmobiliInZone : getAllImmobili;
        fetchImmobili(selectedZone).then(setImmobili).catch(console.error);
    }, [selectedZone]);

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

    useEffect(() => {
        setPage(1);
        setSlicedImmobili(visibleImmobili.length > element_per_page ? visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page) : visibleImmobili);
    }, [visibleImmobili]);

    useEffect(() => {
        setSlicedImmobili(visibleImmobili.length > element_per_page ? visibleImmobili.slice((page - 1) * element_per_page, page * element_per_page) : visibleImmobili);
    }, [page]);

    return (
        <VisibleImmobiliContext.Provider value={[visibleImmobili, setVisibleImmobili]}>
            <ImmobiliContext.Provider value={immobili}>
                <SelectedZoneContext.Provider value={selectedZone}>
                    {mapView}
                </SelectedZoneContext.Provider>
            </ImmobiliContext.Provider>
        </VisibleImmobiliContext.Provider>
    );
};

export default HomepageComponent;