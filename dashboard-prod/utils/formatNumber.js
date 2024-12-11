export const formatNumber = (number) => {
    const formatter = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const formattedNumber = formatter.format(number);

    return formattedNumber;
  };

  export const getDateWithFRFormat = (dateIso) => {
    const date = new Date(dateIso);
    const day = date.getUTCDate() + 1;
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    return `${getZero(day)}/${getZero(month)}/${year}`
  }

  export const getDateWithFormatAPI = (dateIso) => {
    const date = new Date(dateIso);
    date.setHours(15);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    return `${year}${getZero(month)}${getZero(day)}`
  }

  const getZero = (number) => {
    if (number < 10){
      return `0${number}`
    } else {
      return number;
    }
  };