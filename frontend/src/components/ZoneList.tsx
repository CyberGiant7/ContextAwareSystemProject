// frontend/src/components/ZoneList.tsx
import {zona_urbanistica} from "@/lib/definitions";
import React from "react";

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
        <div>
            <h2>Zone su mappa</h2>
            {zone.map((zone) => (
                <div key={zone.zona_di_prossimita}>
                    <input
                        type="checkbox"
                        id={zone.zona_di_prossimita}
                        name={zone.zona_di_prossimita}
                        checked={selectedZoneUrbanistiche[zone.zona_di_prossimita] || false}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor={zone.zona_di_prossimita} style={{marginLeft: "10pt", fontSize: "small"}}>
                        {zone.zona_di_prossimita.toLowerCase()}
                    </label><br></br>
                </div>
            ))}
        </div>
    )
}