/**
 * Converts a string to title case.
 * @param {string} str - The string to convert.
 * @returns {string} - The converted string in title case.
 */
export function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

/**
 * Formats a number with commas as thousand separators.
 * @param {number} x - The number to format.
 * @returns {string} - The formatted number with commas.
 */
export function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Converts a number to a string with 'K' or 'M' suffix.
 * @param {number} x - The number to convert.
 * @returns {string} - The converted string with 'K' or 'M' suffix.
 */
export function numberToK(x: number) {
    if (x < 1000) {
        return x.toString();
    }
    if (x < 1000000) {
        return (x / 1000) + "K";
    }
    return (x / 1000000).toFixed(1) + "M";
}

/**
 * Calculates the color based on rank, interpolating between red and green.
 * @param {number} rank - The current rank.
 * @param {number} maxRank - The maximum rank.
 * @returns {string} - The calculated color in rgb format.
 */
export const getColorFromRank = (rank: number, maxRank: number): string => {
    const red = Math.min(255, 255 - Math.floor((rank / maxRank) * 255));
    const green = Math.min(255, Math.floor((rank / maxRank) * 255));
    return `rgb(${red},${green},0)`; // Interpolating between red and green
};