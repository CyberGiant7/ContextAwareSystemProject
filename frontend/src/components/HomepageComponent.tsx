import React, {createContext, useContext, useEffect, useState} from 'react';
import {getAllImmobili, getAllImmobiliInZone} from "@/queries/immobili";
import {getAllZone} from "@/queries/zone";
import {immobile, zona_urbanistica} from "@/lib/definitions";
import MapView from '@/components/MapViewComponent';
import {SearchParamsContext} from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import {useSession} from "next-auth/react";

export const SelectedZoneContext = createContext<string[]>([]);
export const ImmobiliContext = createContext<immobile[]>([]);
export const VisibleImmobiliContext = createContext<[immobile[], React.Dispatch<React.SetStateAction<immobile[]>>]>([[], () => {
}]);
export const SelectedImmobileContext = createContext<[string | null, React.Dispatch<React.SetStateAction<string | null>>]>([null, () => {
}]);
export const ZoneContext = createContext<zona_urbanistica[]>([]);

const HomepageComponent: React.FC = () => {
    const [immobili, setImmobili] = useState<immobile[]>([]);
    const [page, setPage] = useState(1);
    const [visibleImmobili, setVisibleImmobili] = useState<immobile[]>([]);
    const [slicedImmobili, setSlicedImmobili] = useState<immobile[]>([]);
    const [mapView, setMapView] = useState<JSX.Element>();
    const [selectedImmobile, setSelectedImmobile] = useState<string | null>(null);

    const searchParams = useContext(SearchParamsContext);
    const selected_zone_param = searchParams?.getAll('zona') as string | string[];
    const order_param = searchParams?.get('order') as string;
    const [selectedZone, setSelectedZone] = useState<string[]>(Array.isArray(selected_zone_param) ? selected_zone_param : [selected_zone_param].filter(Boolean));

    const session = useSession();
    const user = session.data?.user;
    let element_per_page = 10;

    useEffect(() => {
        if (user) {
            if (selectedZone.length === 0) {
                console.log('fetching all immobili' + order_param);
                console.log(user?.email);
                getAllImmobili(order_param === 'rank', user?.email).then(setImmobili).catch(console.error);
            } else {
                getAllImmobiliInZone(selectedZone, order_param === 'rank', user?.email).then(setImmobili).catch(console.error);
            }
        } else {
            if (selectedZone.length === 0) {
                console.log('fetching all immobili' + order_param);
                getAllImmobili(false).then(setImmobili).catch(console.error);
            } else {
                getAllImmobiliInZone(selectedZone, false).then(setImmobili).catch(console.error);
            }
        }
        // const fetchImmobili = selectedZone.length > 0 ? getAllImmobiliInZone : getAllImmobili;
        // fetchImmobili(selectedZone).then(setImmobili).catch(console.error);
    }, [selectedZone, user?.email]);


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
        <SelectedImmobileContext.Provider value={[selectedImmobile, setSelectedImmobile]}>
            <VisibleImmobiliContext.Provider value={[visibleImmobili, setVisibleImmobili]}>
                <ImmobiliContext.Provider value={immobili}>
                    <SelectedZoneContext.Provider value={selectedZone}>
                        {mapView}
                    </SelectedZoneContext.Provider>
                </ImmobiliContext.Provider>
            </VisibleImmobiliContext.Provider>
        </SelectedImmobileContext.Provider>
    );
};

export default HomepageComponent;