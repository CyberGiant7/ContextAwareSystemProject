"use client";
import React, {createContext, useContext, useEffect, useState} from "react";
import {immobile} from "@/lib/definitions";
import {SearchParamsContext} from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import {useSessionData} from "@/lib/useSessionData";
import {getAllImmobili} from "@/queries/immobili";

/**
 * Context to store the list of immobili and its setter function.
 */
export const ImmobiliContext = createContext<[immobile[], React.Dispatch<React.SetStateAction<immobile[]>>]>([[], () => {
}]);

/**
 * Context to store the selected zones.
 */
export const SelectedZoneContext = createContext<string[]>([]);

/**
 * Context to store the list of visible immobili and its setter function.
 */
export const VisibleImmobiliContext = createContext<[immobile[], React.Dispatch<React.SetStateAction<immobile[]>>]>([[], () => {
}]);

/**
 * Context to store the selected immobile and its setter function.
 */
export const SelectedImmobileContext = createContext<[string | null, React.Dispatch<React.SetStateAction<string | null>>]>([null, () => {
}]);

/**
 * Context to store the sorting criteria and its setter function.
 */
export const SortedByContext = createContext<[string | null, React.Dispatch<React.SetStateAction<string | null>>]>([null, () => {
}]);

/**
 * DataWrapper component that provides context values to its children.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.JSX.Element} The rendered component.
 */
export default function DataWrapper({children}: Readonly<{ children: React.ReactNode; }>): React.JSX.Element {
    // State to store the list of all immobili
    const [immobili, setImmobili] = useState<immobile[]>([]);

    // State to store the list of visible immobili
    const [visibleImmobili, setVisibleImmobili] = useState<immobile[]>([]);

    // State to store the selected immobile
    const [selectedImmobile, setSelectedImmobile] = useState<string | null>(null);

    // State to store the sorting criteria
    const [sortedBy, setSortedBy] = useState<string | null>(null);

    // Context to get search parameters
    const searchParams = useContext(SearchParamsContext);

    // Get the selected zone parameter from search parameters
    const selected_zone_param = searchParams?.getAll('zona') as string | string[];

    // Get the radius parameter from search parameters
    const radius_param = searchParams?.get('radius') as string;

    // State to store the selected zones
    const [selectedZone, setSelectedZone] = useState<string[]>(Array.isArray(selected_zone_param) ? selected_zone_param : [selected_zone_param].filter(Boolean));

    // Get the rank mode parameter from search parameters
    const rank_mode_param = searchParams?.get('rank_mode') as string;

    // Get the session data
    const session = useSessionData();
    const user = session.data?.user;

    // Effect to update selected zones when search parameters change
    useEffect(() => {
        const selected_zone_param = searchParams?.getAll('zona') as string | string[];
        setSelectedZone(Array.isArray(selected_zone_param) ? selected_zone_param : [selected_zone_param].filter(Boolean));
    }, [searchParams]);

    // Effect to fetch and update the list of immobili when selectedZone, user email, or sortedBy changes
    useEffect(() => {
        getAllImmobili({
            orderByRank: user !== undefined && sortedBy == "rank", // Order by rank if user is defined and sortedBy is "rank"
            zone: selectedZone, // Filter by selected zones
            email: user?.email, // Filter by user email
            radius: radius_param, // Filter by radius parameter
            rankMode: rank_mode_param // Filter by rank mode parameter
        }).then(setImmobili).catch(console.error); // Update immobili state or log error
    }, [selectedZone, user?.email, sortedBy]); // Dependencies for the effect

    return (
        <SelectedImmobileContext.Provider value={[selectedImmobile, setSelectedImmobile]}>
            <VisibleImmobiliContext.Provider value={[visibleImmobili, setVisibleImmobili]}>
                <ImmobiliContext.Provider value={[immobili, setImmobili]}>
                    <SelectedZoneContext.Provider value={selectedZone}>
                        <SortedByContext.Provider value={[sortedBy, setSortedBy]}>
                            {children}
                        </SortedByContext.Provider>
                    </SelectedZoneContext.Provider>
                </ImmobiliContext.Provider>
            </VisibleImmobiliContext.Provider>
        </SelectedImmobileContext.Provider>
    );
}