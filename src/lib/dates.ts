// Date and number formatting in the site's voice ("31 October 2026", "Twelve dishes").
// Dates are ISO calendar days; they are parsed as UTC so the day never shifts with the server's zone.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const parts = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
};

export function formatDay(iso: string, withYear = false) {
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]}${withYear ? ` ${y}` : ''}`;
}

/** "31 OCT 2026", for the visa stamp. */
export function stampDate(iso: string) {
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1].slice(0, 3).toUpperCase()} ${y}`;
}

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const TENS = ['', '', 'twenty', 'thirty', 'forty'];

export function numberWord(n: number, capital = false) {
  let w: string;
  if (n <= 20) w = WORDS[n];
  else if (n < 50) w = TENS[Math.floor(n / 10)] + (n % 10 ? `-${WORDS[n % 10]}` : '');
  else w = String(n);
  return capital ? w.charAt(0).toUpperCase() + w.slice(1) : w;
}
