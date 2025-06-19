interface DateRangeState {
  currentDate: Date;
  minDate: Date;
  maxDate: Date;
}

const createDateRange = (
  startDate: string,
  minDate: string,
  maxDate: string = new Date().toISOString().split('T')[0],
): DateRangeState => {
  return {
    currentDate: new Date(startDate),
    minDate: new Date(minDate),
    maxDate: new Date(maxDate),
  };
};

const prevDateRange = (state: DateRangeState): void => {
  const newDate = new Date(state.currentDate);
  newDate.setDate(state.currentDate.getDate() - 7);

  if (newDate >= state.minDate) {
    state.currentDate = newDate;
  } else {
    state.currentDate = new Date(state.minDate);
  }

  displayCurrentDate(state);
};

const nextDateRange = (state: DateRangeState): void => {
  const newDate = new Date(state.currentDate);
  newDate.setDate(state.currentDate.getDate() + 7);

  if (newDate <= state.maxDate) {
    state.currentDate = newDate;
  } else {
    state.currentDate = new Date(state.maxDate);
  }

  displayCurrentDate(state);
};

const displayCurrentDate = (state: DateRangeState): string => {
  const date = state.currentDate.toISOString().split('T')[0];
  return date;
};

// Usage example:
export {createDateRange, prevDateRange, nextDateRange, displayCurrentDate};
// Initialize the date range state
// const dateRangeState = createDateRange('2023-05-01', '2023-01-01');

// Display the current date (should be the start date)
// displayCurrentDate(dateRangeState); // 2023-05-01

// Move back by 7 days
// prevDateRange(dateRangeState); // 2023-04-24

// Move forward by 7 days
// nextDateRange(dateRangeState); // 2023-05-01

// Move forward by 7 days (should go to the next week if within max date)
// nextDateRange(dateRangeState); // 2023-05-08

// Keep clicking next to see how it reaches the max date (which is today if not specified)
