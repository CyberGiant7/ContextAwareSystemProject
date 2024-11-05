import {useMap} from "react-leaflet";
import {Button} from "react-bootstrap";
import React, {useMemo} from "react";
import {usePathname, useRouter} from "next/navigation";
import {MDBRow} from "mdb-react-ui-kit";

const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomcenter: 'leaflet-bottom leaflet-center',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
    center: 'leaflet-top leaflet-center',
}


export function ButtonOnMapComponent({position}: { position?: keyof typeof POSITION_CLASSES }) {
    const parentMap = useMap()
    const router = useRouter()
    let pathname = usePathname()

    // Memoize the minimap so it's not affected by position changes
    const button = useMemo(
        () => (
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
            }} >
                <Button type={"reset"} onClick={() => {
                    router.push("/select-zone?prevUrl=" + pathname);
                    // router.refresh()
                }}>
                    Scegli la zona
                </Button>
                <Button type={"reset"} onClick={() => {
                    router.push("/custom-zones?prevUrl=" + pathname);
                    // router.refresh()
                }}>
                    Distanza da un punto
                </Button>
            </div>
        ),
        [],
    )

    const positionClass =
        (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright
    return (
        <div className={positionClass}>
            <div className="leaflet-control leaflet-bar">{button}</div>
        </div>
    )
}