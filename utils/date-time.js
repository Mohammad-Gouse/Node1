const moment = require("moment");

exports.calculateNextTaskOccurrence = (schedule, startDate) => {
  // Get the current date and time
  const currentDate = moment().format("YYYY-MM-DD");
  startDate = moment(startDate).format("YYYY-MM-DD");
  // Parse the schedule
  const [minute, hour, dayOfMonth, month, dayOfWeek] = schedule.split(" ");
  // Calculate the next occurrence based on the schedule
  let nextOccurrence = moment(currentDate)
    .set("second", 0)
    .set("millisecond", 0)
    .set("minute", minute)
    .set("hour", hour)
    .set("date", dayOfMonth);
  // .set("month", month - 1) // month is zero-based
  // .set("day", dayOfWeek)
  // .add(dayOfWeek - currentDate.day(), "days");

  // If the scheduled time has already passed in the current week, move to the next week
  if (currentDate.isAfter(nextOccurrence)) {
    nextOccurrence = nextOccurrence.add(1, "week");
  }

  // Check if the next occurrence is today
  if (currentDate.isSame(nextOccurrence, "day")) {
    return nextOccurrence.utcOffset("+05:30").format();
  }
  return nextOccurrence.utcOffset("+05:30").format();
};

// Function to calculate the next occurrence of the task based on schedule
exports.calculateNextTaskOccurrencePartTwo = (scheduler, date) => {
  let isToday = false;
  const { startDate, startTime, dueDate, dueTime, frequencyType, frequencyInterval, weeksToRun } = scheduler;

  const currentDate = moment(date);

  // Determine the start and due date and time for calculating the next occurrence
  let nextDueOccurrenceDate = moment(dueDate + " " + dueTime, "YYYY-MM-DD HH:mm");
  let nextOccurrenceDate = moment(startDate + " " + startTime, "YYYY-MM-DD HH:mm");

  // Adjust the start date and time based on the current date and frequencyType
  switch (frequencyType) {
    case "days":
      if (parseInt(frequencyInterval) !== 0) {
        while (nextOccurrenceDate.isBefore(currentDate)) {
          nextOccurrenceDate.add(parseInt(frequencyInterval), "days");
          nextDueOccurrenceDate.add(parseInt(frequencyInterval), "days");
        }
      }
      break;
    case "weeks":
      while (nextOccurrenceDate.isBefore(currentDate)) {
        nextOccurrenceDate.add(parseInt(frequencyInterval), "weeks");
        nextDueOccurrenceDate.add(parseInt(frequencyInterval), "weeks");
      }
      break;
    case "months":
      while (nextOccurrenceDate.isBefore(currentDate)) {
        nextOccurrenceDate.add(parseInt(frequencyInterval), "months");
        nextDueOccurrenceDate.add(parseInt(frequencyInterval), "months");
      }
      break;
    case "years":
      while (nextOccurrenceDate.isBefore(currentDate)) {
        nextOccurrenceDate.add(parseInt(frequencyInterval), "years");
        nextDueOccurrenceDate.add(parseInt(frequencyInterval), "years");
      }
      break;
    default:
      // For once occurrence, just return the start date and time
      return {
        nextOccurrence: nextOccurrenceDate.toDate(),
        dueOccurrence: nextDueOccurrenceDate.toDate(),
        isToday: nextOccurrenceDate.isSame(currentDate, "day"),
      };
  }

  // If the frequencyType is monthly and weeksToRun is specified
  if (frequencyType === "monthly" && weeksToRun) {
    // Adjust the nextOccurrenceDate to match the specified weeks
    const monthOfNextOccurrence = nextOccurrenceDate.month();
    nextOccurrenceDate.weekday(0); // Move to the first day of the week
    weeksToRun.forEach((week) => {
      nextOccurrenceDate.month(monthOfNextOccurrence); // Reset to the month of nextOccurrenceDate
      nextOccurrenceDate.add(week - 1, "weeks"); // Move to the specified week
      if (nextOccurrenceDate.isBefore(currentDate)) {
        nextOccurrenceDate.add(1, "months"); // If the specified week has passed, move to the next month
      }
    });
  }

  isToday = nextOccurrenceDate.isSame(currentDate, "day");

  const taskDate = nextOccurrenceDate.toDate();
  const taskDueDate = nextDueOccurrenceDate.toDate();
  return {
    isToday: isToday,
    nextOccurrence: taskDate,
    dueOccurrence: taskDueDate,
    taskTime: moment(taskDate).format("HH:MM"),
    taskDate: moment(taskDate).format("YYYY-MM-DD"),
  };
};
