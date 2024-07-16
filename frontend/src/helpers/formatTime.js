// Function to format the created time
function formatTime(createdTime) {
  const creationDate = new Date(createdTime);

  // Function to format the date
  function formatDate(date) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  // Function to check if the date is today, yesterday, or another day
  function getDayLabel(date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return daysOfWeek[date.getDay()];
    }
  }

  const dayLabel = getDayLabel(creationDate);
  const formattedCreationDate = formatDate(creationDate);

  return `${dayLabel}, ${formattedCreationDate}`;
}

export default formatTime;
