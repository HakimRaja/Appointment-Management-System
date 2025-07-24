const getDate = (start_time,date) => {
    let startTimeForDate = parseInt(start_time.slice(0,2)) - 5;
    startTimeForDate = `${startTimeForDate.toString().padStart(2,'0')}${start_time.slice(2)}`
    const dateWithTime = `${date}T${startTimeForDate}`;
    return dateWithTime;
}

module.exports = getDate;