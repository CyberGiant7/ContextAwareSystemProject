import {zona_urbanistica} from "@/lib/definitions";
import React from "react";
import {toTitleCase} from "@/lib/utils";

type ZoneListProps = {
    zone: zona_urbanistica[];
    selectedZoneUrbanistiche: Record<string, boolean>;
    setSelectedZoneUrbanistiche: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

/**
 * ZoneList component renders a list of checkboxes for each zone.
 *
 * @param {ZoneListProps} props - The properties for the component.
 * @param {zona_urbanistica[]} props.zone - Array of zone objects.
 * @param {Record<string, boolean>} props.selectedZoneUrbanistiche - Object representing selected zones.
 * @param {React.Dispatch<React.SetStateAction<Record<string, boolean>>>} props.setSelectedZoneUrbanistiche - Function to update selected zones.
 * @returns {React.JSX.Element} The rendered component.
 */
export default function ZoneList({
                                     zone,
                                     selectedZoneUrbanistiche,
                                     setSelectedZoneUrbanistiche
                                 }: ZoneListProps): React.JSX.Element {

    /**
     * Handles the change event for the checkboxes.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
     */
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        setSelectedZoneUrbanistiche(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    return (
        <div style={{width: "-webkit-fit-content"}}>
            {zone.map((zone) => (
                <div key={zone.zona_di_prossimita}>
                    <input
                        type="checkbox"
                        id={zone.zona_di_prossimita}
                        name={zone.zona_di_prossimita}
                        checked={selectedZoneUrbanistiche[zone.zona_di_prossimita] || false}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor={zone.zona_di_prossimita}
                           style={{marginLeft: "10pt", fontSize: "large", fontWeight: "lighter"}}>
                        {toTitleCase(zone.zona_di_prossimita)}
                    </label><br></br>
                </div>
            ))}
        </div>
    )
}