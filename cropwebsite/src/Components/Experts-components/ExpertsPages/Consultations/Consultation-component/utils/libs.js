export function formatDate(date) {
    const today = new Date();
    const inputDate = new Date(date);

    const isToday = today.toDateString() === inputDate.toDateString();
    const isSameYear = today.getFullYear() === inputDate.getFullYear();

    if (isToday) {
        return "Today";
    }

    const options = { month: 'short', day: 'numeric' };
    if (isSameYear) {
        options.hour = 'numeric';
        options.minute = 'numeric';
    } else {
        options.year = 'numeric';
    }

    return inputDate.toLocaleString('en-US', options);
}