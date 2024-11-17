// frontend/src/components/ImmobileCardContainerComponent.tsx
import { immobile } from "@/lib/definitions";
import {ImmobileCard} from "@/components/ImmobileCardComponent";
import React from "react";

/**
 * ImmobileCardContainer component
 *
 * @param {Object} props - Component properties
 * @param {immobile[]} props.immobili - Array of immobile objects
 * @returns {React.JSX.Element} A container component that renders a list of ImmobileCard components
 */
export function ImmobileCardContainer({ immobili }: { immobili: immobile[] }): React.JSX.Element {
    return (
        <div>
            {immobili.map((immobile) => (
                <ImmobileCard key={immobile.civ_key} immobile={immobile} />
            ))}
        </div>
    );
}