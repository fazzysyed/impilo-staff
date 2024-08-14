import moment from 'moment';

export const DateFormat = inputDateString => {
  // Parse the input string using moment and specify the input format
  const formattedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss').format(
    'MMM. DD, YYYY',
  );

  return formattedDate;
};
