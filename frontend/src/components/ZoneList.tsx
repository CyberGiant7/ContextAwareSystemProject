import {zona_urbanistica} from "@/lib/definitions";

type ZoneListProps = {
    zone: zona_urbanistica[];
}

export default function ZoneList(props: ZoneListProps) {

    // zone checklist
    return (
        <div>
            <h2>Zone su mappa</h2>
                {props.zone.map((zone) => (
                    <>
                        <input type="checkbox" id={zone.zona_di_prossimita} name={zone.zona_di_prossimita}
                               value={zone.zona_di_prossimita}/>
                        <label htmlFor={zone.zona_di_prossimita} style={{marginLeft: "10pt", fontSize: "small"}}>{zone.zona_di_prossimita.toLowerCase()}</label><br></br>
                    </>
                ))}

        </div>
    )
}