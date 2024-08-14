export const formatPhoneNumber = (text, previousText) => {
  if (!text) return text;

  const deleting = previousText && previousText.length > text.length;
  if (deleting) {
    return text;
  }

  let cleaned = text.replace(/\D/g, ""); // remove non-digit characters
  let match = null;

  if (cleaned.length > 0 && cleaned.length < 2) {
    return `(${cleaned}`;
  } else if (cleaned.length == 3) {
    return `(${cleaned}) `;
  } else if (cleaned.length > 3 && cleaned.length < 5) {
    match = cleaned.match(/(\d{3})(\d{1,3})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}`;
    }
  } else if (cleaned.length == 6) {
    match = cleaned.match(/(\d{3})(\d{3})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-`;
    }
  } else if (cleaned.length > 6) {
    match = cleaned.match(/(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  }

  return text;
};
