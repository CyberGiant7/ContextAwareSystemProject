export function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

export function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function numberToK(x: number) {
    if (x < 1000) {
        return x.toString();
    }
    if (x < 1000000) {
        return (x / 1000) + "K";
    }
    return (x / 1000000).toFixed(1) + "M";
}

// A utility function to calculate the color based on rank (0 being red, max being green)
export const getColorFromRank = (rank: number, maxRank: number): string => {
    const red = Math.min(255, 255 - Math.floor((rank / maxRank) * 255));
    const green = Math.min(255, Math.floor((rank / maxRank) * 255));
    return `rgb(${red},${green},0)`; // Interpolating between red and green
};
