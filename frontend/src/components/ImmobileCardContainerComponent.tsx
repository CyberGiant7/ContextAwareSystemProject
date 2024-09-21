// frontend/src/components/ImmobileCardContainerComponent.tsx
import { immobile } from "@/lib/definitions";
import {ImmobileCard} from "@/components/ImmobileCardComponent";

export function ImmobileCardContainer({ immobili }: { immobili: immobile[] }) {
    return (
        <div>
            {immobili.map((immobile) => (
                <>
                <ImmobileCard key={immobile.civ_key} immobile={immobile} />
                <div className={"divider-horizontal"} />
                </>
            ))}
        </div>
    );
}