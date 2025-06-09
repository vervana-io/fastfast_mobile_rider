import 'intl';
import 'intl/locale-data/jsonp/en';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const formatter = {
  cutText(
    text: {
      split: (arg0: string) => {(): any; new (): any; length: number};
      substring: (arg0: number, arg1: any) => any;
    },
    length: any,
  ) {
    if (text.split(' ').length > 1) {
      let string = text.substring(0, length);
      let splitText = string.split(' ');
      splitText.pop();
      return splitText.join(' ') + '...';
    } else {
      return text;
    }
  },
  FormatRawDate(date: string) {
    date = date.split(' ').join(' ');
    return date;
  },
  formatDate(
    date: string | number | Date | dayjs.Dayjs | null | undefined,
    format: string | undefined,
  ) {
    if (date === undefined || date === '') {
      return dayjs().format(format);
    } else {
      return dayjs(date).format(format);
    }
  },
  capitalizeFirstLetter(string: string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  },
  onlyNumber(number: string) {
    if (number) {
      return number.replace(/\D/g, '');
    } else {
      return '';
    }
  },
  FormatNumber(number: number | bigint) {
    const nf = new Intl.NumberFormat();
    return nf.format(number);
  },
  FormatCurrencyIntl(cur: number, reg: string | undefined) {
    return reg + this.formatCurrencySimple(cur);
    // if (typeof cur === 'number' && !isNaN(cur)) {
    //   return new Intl.NumberFormat('en-US', {
    //     style: 'currency',
    //     currency: reg === undefined || reg === null || reg === '' ? 'NGN' : reg,
    //     currencyDisplay: 'narrowSymbol',
    //   }).format(cur);
    // } else {
    //   return new Intl.NumberFormat('en-US', {
    //     style: 'currency',
    //     currency: 'NGN',
    //     currencyDisplay: 'narrowSymbol',
    //   }).format(0);
    // }
  },
  NewFormatCurrencyIntl(cur: number, reg: string | undefined) {
    if (cur && !isNaN(cur)) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: typeof reg === 'string' ? reg : 'NGN',
        currencyDisplay: 'narrowSymbol',
      }).format(cur);
    }
  },
  formatCurrency(number: {toString: () => string}) {
    if (number) {
      let formattedNumber = number.toString().replace(/\D/g, '');
      let rest = formattedNumber.length % 3;
      let currency = formattedNumber.substr(0, rest);
      let thousand = formattedNumber.substr(rest).match(/\d{3}/g);
      let separator;

      if (thousand) {
        separator = rest ? '.' : '';
        currency += separator + thousand.join('.');
      }

      return currency;
    } else {
      return '';
    }
  },
  formatCurrencySimple(input: number | string) {
    const num = Number(input);
    if (isNaN(num)) return '0.00';
    return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  },
  timeAgo(time: any) {
    let date: any = new Date(
        (time || '').replace(/-/g, '/').replace(/[TZ]/g, ' '),
      ),
      diff = (new Date().getTime() - date.getTime()) / 1000,
      dayDiff = Math.floor(diff / 86400);

    if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
      return dayjs(time).format('MMMM DD, YYYY');
    }

    return (
      (dayDiff === 0 &&
        ((diff < 60 && 'just now') ||
          (diff < 120 && '1 minute ago') ||
          (diff < 3600 && Math.floor(diff / 60) + ' minutes ago') ||
          (diff < 7200 && '1 hour ago') ||
          (diff < 86400 && Math.floor(diff / 3600) + ' hours ago'))) ||
      (dayDiff === 1 && 'Yesterday') ||
      (dayDiff < 7 && dayDiff + ' days ago') ||
      (dayDiff < 31 && Math.ceil(dayDiff / 7) + ' weeks ago')
    );
  },
  createdAtTimeAgo(time: any) {
    const res = dayjs().from(dayjs(time), true);
    return res + ' ago';
  },
  diffTimeByNow(time: string | number | Date | dayjs.Dayjs | null | undefined) {
    let startDate = dayjs(dayjs().format('YYYY-MM-DD HH:mm:ss').toString());
    let endDate = dayjs(dayjs(time).format('YYYY-MM-DD HH:mm:ss').toString());
    const dayjss: any = dayjs;
    let durationD = dayjss.duration(endDate.diff(startDate));
    let milliseconds = Math.floor(durationD.asMilliseconds());

    let days = Math.round(milliseconds / 86400000);
    let hours = Math.round((milliseconds % 86400000) / 3600000);
    let minutes = Math.round(((milliseconds % 86400000) % 3600000) / 60000);
    let seconds = Math.round(
      (((milliseconds % 86400000) % 3600000) % 60000) / 1000,
    );

    if (seconds < 30 && seconds >= 0) {
      minutes += 1;
    }

    return {
      days: days.toString().length < 2 ? '0' + days : days,
      hours: hours.toString().length < 2 ? '0' + hours : hours,
      minutes: minutes.toString().length < 2 ? '0' + minutes : minutes,
      seconds: seconds.toString().length < 2 ? '0' + seconds : seconds,
    };
  },
  diffTimeByDate(
    start: string | number,
    end: string | number | Date | dayjs.Dayjs | null | undefined,
  ) {
    let startDate = dayjs(
      dayjs(start).format('YYYY-MM-DD HH:mm:ss').toString(),
    );
    let endDate = dayjs(dayjs(end).format('YYYY-MM-DD HH:mm:ss').toString());

    let durationD = dayjs.duration(endDate.diff(startDate));

    let milliseconds = Math.floor(durationD.asMilliseconds());

    let days = Math.round(milliseconds / 86400000);
    let hours = Math.round((milliseconds % 86400000) / 3600000);
    let minutes = Math.round(((milliseconds % 86400000) % 3600000) / 60000);
    let seconds = Math.round(
      (((milliseconds % 86400000) % 3600000) % 60000) / 1000,
    );

    if (seconds < 30 && seconds >= 0) {
      minutes += 1;
    }

    return {
      days: days.toString().length < 2 ? '0' + days : days,
      hours: hours.toString().length < 2 ? '0' + hours : hours,
      minutes: minutes.toString().length < 2 ? '0' + minutes : minutes,
      seconds: seconds.toString().length < 2 ? '0' + seconds : seconds,
    };
  },
  timeDifference(date1: number, date2: number) {
    var difference = date1 - date2;

    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24;

    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60;

    var minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60;

    var secondsDifference = Math.floor(difference / 1000);

    return minutesDifference;
  },
  isset(obj: {}) {
    return Object.keys(obj).length;
  },
  assign(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  },
  delay(time: number | undefined) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  },
  randomNumbers(from: number, to: number, length: number) {
    let numbers = [0];
    for (let i = 1; i < length; i++) {
      numbers.push(Math.ceil(Math.random() * (from - to) + to));
    }

    return numbers;
  },
  replaceAll(str: string, find: string | RegExp, replace: any) {
    return str.replace(new RegExp(find, 'g'), replace);
  },
  getDate(UNIX_timestamp: string | number | Date) {
    var a = new Date(UNIX_timestamp);
    var date = a.getDate();
    return date;
  },
  getMonth(UNIX_timestamp: string | number | Date) {
    var a = new Date(UNIX_timestamp);
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var month = months[a.getMonth()];
    return month;
  },
  getYear(UNIX_timestamp: string | number | Date) {
    var a = new Date(UNIX_timestamp);
    var year = a.getFullYear();
    return year;
  },
  generatePassword(
    numberToGenerate: string | undefined,
    passwordLength: string | undefined,
  ) {
    const numbers = '1234567890';
    const upperCases = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCases = 'abcdefghijklmnopqrstuvwxyz';
    const symbols = '!?#$%&*';

    const NUMBER_OF_PASSWORDS_TO_GENERATE =
      numberToGenerate === ''
        ? 1
        : numberToGenerate === undefined
        ? 1
        : numberToGenerate;
    const PASSWORD_LENGTH =
      passwordLength === ''
        ? 12
        : passwordLength === undefined
        ? 12
        : passwordLength;

    let charPool = numbers + upperCases + lowerCases + symbols;

    const randomPasswords = [];
    for (let i = 0; i < NUMBER_OF_PASSWORDS_TO_GENERATE; i++) {
      randomPasswords.push(
        Array(PASSWORD_LENGTH)
          .fill(charPool)
          .map((x: any) => x[Math.floor(Math.random() * x.length)])
          .join(''),
      );
    }

    return randomPasswords;
  },
  formatMobxData<T extends Record<string, unknown>>(
    data: T,
  ): Partial<T> | undefined {
    if (typeof data === 'object' && !Array.isArray(data)) {
      let dt = JSON.stringify(data);
      dt = JSON.parse(dt);
      return dt as unknown as Partial<T>;
    }
    return {};
  },
  generateMultipleRandomOptions(
    numberToGenerate: number | undefined = 0,
    length: number | undefined = 0,
  ) {
    const NUMBER_TO_GENERATE = numberToGenerate === 0 ? 2 : numberToGenerate;

    const NUMBER_LENGTH = length === 0 ? 3 : length;

    let randomMultiple = 0;

    for (let i = 0; i < NUMBER_LENGTH; i++) {
      const randNumber = this.generate(NUMBER_TO_GENERATE);
      randomMultiple = parseInt(randNumber, 10);
    }
    return randomMultiple;
  },
  generate(n: number) {
    var add = 1,
      max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

    if (n > max) {
      const dsl: any = this.generate(max) + this.generate(n - max);
      return dsl;
    }

    max = Math.pow(10, n + add);
    var min = max / 10; // Math.pow(10, n) basically
    var number = Math.floor(Math.random() * (max - min + 1)) + min;

    return ('' + number).substring(add);
  },

  shuffleNumbers(array: number[]) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  },

  trimSpecial(x: string) {
    const re = /^\d+(\.\d{1,2})?$/;
    return re.test(x);
  },

  maskCreditCardNumber(cardNumber: string): string {
    // Remove any non-digit characters from the input
    cardNumber = cardNumber.replace(/\D/g, '');

    // Mask all but the last four digits
    let maskedDigits = cardNumber.length - 4;
    let maskedNumber =
      '*'.repeat(maskedDigits) + cardNumber.substring(maskedDigits);

    // Insert spaces every four digits
    let spacedNumber = maskedNumber.match(/.{1,4}/g)?.join(' ');

    // Return the masked and spaced number
    return spacedNumber || '';
  },

  maskEmail(email: string): string {
    const atIndex = email.indexOf('@');
    const localPart = email.substring(0, atIndex);
    const maskedLocalPart =
      localPart.charAt(0) +
      localPart.substring(1, localPart.length - 1).replace(/./g, '*') +
      localPart.charAt(localPart.length - 1);
    const maskedEmail = maskedLocalPart + email.substring(atIndex);

    return maskedEmail;
  },

  validateDateNotGreaterThanCurrent(dateString: string): boolean {
    const providedDate = new Date(dateString);
    const currentDate = new Date();

    // Set the time of both dates to 0 to compare only the dates, not the times.
    providedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    return providedDate <= currentDate;
  },
  validateDateNotGreaterThan(
    dateString: string,
    comparisonDateString: string,
  ): boolean {
    const providedDate = new Date(dateString);
    const comparisonDate = new Date(comparisonDateString);

    // Set the time of both dates to 0 to compare only the dates, not the times.
    providedDate.setHours(0, 0, 0, 0);
    comparisonDate.setHours(0, 0, 0, 0);

    return providedDate <= comparisonDate;
  },
  getInitials(firstString: string, lastString: string): string {
    const firstInitial = firstString.charAt(0);
    const lastInitial = lastString.charAt(0);
    return `${firstInitial}${lastInitial}`;
  },
  digit_filter(digits: number) {
    return digits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  numberToWords(number: number): string {
    const ones = [
      'Zero',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
    ];

    const teens = [
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];

    const tens = [
      'Ten',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];

    function convertTwoDigits(n: number): string {
      if (n < 10) {
        return ones[n];
      } else if (n < 20) {
        return teens[n - 11];
      } else {
        const ten = Math.floor(n / 10);
        const one = n % 10;
        return `${tens[ten - 1]}${one > 0 ? ` ${ones[one]}` : ''}`;
      }
    }

    function convertThreeDigits(n: number): string {
      const hundred = Math.floor(n / 100);
      const remainder = n % 100;
      if (hundred > 0) {
        return `${ones[hundred]} Hundred${
          remainder > 0 ? ` ${convertTwoDigits(remainder)}` : ''
        }`;
      } else {
        return convertTwoDigits(remainder);
      }
    }

    function convertAmountToWords(amount: number): string {
      const nairaPart = Math.floor(amount);
      const koboPart = Math.round((amount - nairaPart) * 100);

      let words = '';

      if (nairaPart > 0) {
        words = convertThreeDigits(nairaPart) + ' Naira';
      } else {
        words = 'Zero Naira';
      }

      if (koboPart > 0) {
        words +=
          koboPart === 1
            ? ' and One Kobo'
            : ` and ${convertTwoDigits(koboPart)} Kobo`;
      } else {
        words += ' Only';
      }

      return words;
    }

    console.log('convert su ', number);

    // return convertAmountToWords(number);
  },

  numberToWords2(number: number, currency: string): string {
    const units: string[] = [
      '',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
    ];
    const teens: string[] = [
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
    ];
    const tens: string[] = [
      '',
      '',
      'twenty',
      'thirty',
      'forty',
      'fifty',
      'sixty',
      'seventy',
      'eighty',
      'ninety',
    ];
    const scales: string[] = [
      '',
      'thousand',
      'million',
      'billion',
      'trillion',
      'quadrillion',
      'quintillion',
      'sextillion',
      'septillion',
      'octillion',
      'nonillion',
      'decillion',
    ];

    if (number === 0) {
      return `zero ${currency}`;
    }

    let words = '';
    let i = 0;

    if (number % 1000 !== 0) {
      let numString = number.toString();
      const lastThree = parseInt(numString.slice(-3), 10);
      const remaining = parseInt(numString.slice(0, -3), 10);

      if (remaining > 0) {
        words = this.numberToWords2(remaining, currency) + ' thousand ';
      }

      number = lastThree;
    }

    while (number > 0) {
      if (number % 1000 !== 0) {
        let word = '';
        if (number % 100 < 20) {
          word = units[number % 100];
          number = Math.floor(number / 100);
        } else {
          word = units[number % 10];
          number = Math.floor(number / 10);

          word = tens[number % 10] + (word !== '' ? '-' + word : '');
          number = Math.floor(number / 10);
        }

        if (word !== '') {
          words = word + ' ' + scales[i] + ' ' + words;
        }
      }
      number = Math.floor(number / 1000);
      i++;
    }

    const finalWords = words.trim();

    if (currency.toLowerCase() === 'ngn') {
      const kobo = (number * 100).toFixed(0);
      // return `${finalWords} naira and ${kobo} kobo`;
    }

    // return `${finalWords} ${currency}`;
  },

  convertDaysToYearsMonthsDays(days: number): string {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = (days % 365) % 30;

    let result = '';

    if (years > 0) {
      result += `${years} ${years === 1 ? 'year' : 'years'}`;
    }

    if (months > 0) {
      result += `${result !== '' ? ', ' : ''}${months} ${
        months === 1 ? 'month' : 'months'
      }`;
    }

    if (remainingDays > 0) {
      result += `${result !== '' ? ', ' : ''}${remainingDays} ${
        remainingDays === 1 ? 'day' : 'days'
      }`;
    }

    return result;
  },

  calculateDaysLeftFromDate(futureDate: Date): number {
    const currentDate = new Date();
    const timeDifference = futureDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    return daysDifference > 0 ? daysDifference : 0;
  },

  truncateEmail(email: string, maxLength: number): string {
    const atIndex = email.indexOf('@');

    if (atIndex !== -1) {
      const localPart = email.slice(0, atIndex);
      const truncatedLocalPart =
        localPart.length > maxLength
          ? localPart.slice(0, maxLength) + '...'
          : localPart;
      return truncatedLocalPart + email.slice(atIndex);
    } else {
      // Handle the case where '@' is not present in the email address
      return email;
    }
  },
};
