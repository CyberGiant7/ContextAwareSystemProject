import {Button} from "react-bootstrap";
import React, {useMemo} from "react";
import {usePathname, useRouter} from "next/navigation";

/**
 * Mapping of position keys to their corresponding CSS classes for positioning the button on the map.
 */
const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomcenter: 'leaflet-bottom leaflet-center',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
    center: 'leaflet-top leaflet-center',
}


/**
 * ButtonOnMapComponent renders a button on the map at a specified position.
 *
 * @param {Object} props - The component props.
 * @param {keyof typeof POSITION_CLASSES} [props.position] - The position of the button on the map.
 * @returns {React.JSX.Element} The rendered component.
 */
export function ButtonOnMapComponent({position}: { position?: keyof typeof POSITION_CLASSES }): React.JSX.Element {
    const router = useRouter()
    let pathname = usePathname()

    // Memoize the button so it's not affected by position changes
    const button = useMemo(
        () => (
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
            }}>
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