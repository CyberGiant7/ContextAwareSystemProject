// frontend/src/components/ZoneList.tsx
import {zona_urbanistica} from "@/lib/definitions";
import React from "react";
import {toTitleCase} from "@/lib/utils";
import {MDBCard} from "mdb-react-ui-kit";

type ZoneListProps = {
    zone: zona_urbanistica[];
    selectedZoneUrbanistiche: Record<string, boolean>;
    setSelectedZoneUrbanistiche: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function ZoneList({zone, selectedZoneUrbanistiche, setSelectedZoneUrbanistiche}: ZoneListProps) {

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        setSelectedZoneUrbanistiche(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    return (
        <div style={{width:"-webkit-fit-content"}}>
            {zone.map((zone) => (
                <div key={zone.zona_di_prossimita}>
                    <input
                        type="checkbox"
                        id={zone.zona_di_prossimita}
                        name={zone.zona_di_prossimita}
                        checked={selectedZoneUrbanistiche[zone.zona_di_prossimita] || false}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor={zone.zona_di_prossimita} style={{marginLeft: "10pt", fontSize: "large", fontWeight: "lighter"}}>
                        {toTitleCase(zone.zona_di_prossimita)}
                    </label><br></br>
                </div>
            ))}
        </div>
    )
}