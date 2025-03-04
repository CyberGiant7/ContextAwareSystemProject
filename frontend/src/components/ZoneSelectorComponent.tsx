"use client";
import React, {useState} from 'react';
import dynamic from "next/dynamic";
import ZoneList from "@/components/ZoneList";
import {zona_urbanistica} from "@/lib/definitions";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdb-react-ui-kit";
import {useRouter, useSearchParams} from "next/navigation";

const LazyZoneSelectorMap = dynamic(() => import("@/components/mapComponents/ZoneSelectorMap"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});


/**
 * ZoneSelectorView component props.
 */
type ZoneSelectorViewProps = {
    zone: zona_urbanistica[];
    setZone: React.Dispatch<React.SetStateAction<zona_urbanistica[]>>;
};

/**
 * ZoneSelectorView component.
 *
 * @param {ZoneSelectorViewProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const ZoneSelectorView: React.FC<ZoneSelectorViewProps> = ({zone, setZone}) => {
    const [selectedZoneUrbanistiche, setSelectedZoneUrbanistiche] = useState<Record<string, boolean>>({});
    const router = useRouter();
    const searchParams = useSearchParams();
    const prevUrl = searchParams.get("prevUrl");

    /**
     * Handles the form submission.
     * Constructs the query string with the selected zones and redirects to the previous URL with the selected parameters.
     */
    const handleSubmit = () => {
        const selectedZones = Object.keys(selectedZoneUrbanistiche)
            .filter(key => selectedZoneUrbanistiche[key]);

        // Construct the query string with the selected zones
        const searchParams = selectedZones.map(zone => `zona=${zone}`).join("&");

        // Get the previous page URL or use a fallback
        const previousUrl = prevUrl ? prevUrl : '/';

        // Redirect to the previous page with the selected parameters
        router.push(`${previousUrl}?${searchParams}`);
    };

    return (
        <MDBContainer fluid style={{height: "100%", display: "flex", flexDirection: "row", padding: '0px'}}>
            <MDBCol lg="auto" style={{
                display: "flex",
                flexDirection: "column",
                minWidth: "300px",
                maxWidth: "fit-content",
                backgroundColor: '#eee'
            }}>
                <MDBRow className="m-2">
                    <h2>Zone su mappa</h2>
                </MDBRow>
                <MDBRow className="m-2 card" style={{flex: 1, overflowY: "scroll", maxHeight: "calc(100vh - 100px)"}}>
                    <ZoneList
                        zone={zone}
                        selectedZoneUrbanistiche={selectedZoneUrbanistiche}
                        setSelectedZoneUrbanistiche={setSelectedZoneUrbanistiche}
                    />
                </MDBRow>
                <MDBRow className="m-2">
                    <MDBBtn color="primary" onClick={handleSubmit}>Conferma</MDBBtn>
                </MDBRow>
            </MDBCol>

            <MDBCol style={{flex: 1, height: "100%"}}>
                <LazyZoneSelectorMap
                    width="100%"
                    selectedZoneUrbanistiche={selectedZoneUrbanistiche}
                    setSelectedZoneUrbanistiche={setSelectedZoneUrbanistiche}
                    zone={zone}
                    setZone={setZone}
                />
            </MDBCol>
        </MDBContainer>
    );
};

export default ZoneSelectorView;