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