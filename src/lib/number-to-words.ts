
// src/lib/number-to-words.ts

const a = [
    '', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ',
    'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '
];
const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num: number): string {
    if (num === 0) return '';
    if (num < 20) {
        return a[num];
    }
    const digit = num % 10;
    const ten = Math.floor(num / 10);
    return b[ten] + (digit ? '-' + a[digit] : '');
}

export function numberToWords(n: number): string {
    if (n === 0) return 'Zero';
    
    let str = '';
    
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    if (crore > 0) {
        str += inWords(crore) + 'crore ';
    }
    
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    if (lakh > 0) {
        str += inWords(lakh) + 'lakh ';
    }
    
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    if (thousand > 0) {
        str += inWords(thousand) + 'thousand ';
    }
    
    const hundred = Math.floor(n / 100);
    n %= 100;
    if (hundred > 0) {
        str += inWords(hundred) + 'hundred ';
    }
    
    if (n > 0) {
        if (str !== '') {
            str += 'and ';
        }
        str += inWords(n);
    }
    
    // Capitalize first letter and trim trailing spaces/hyphens
    return str.replace(/-/g, ' ').trim().replace(/\s\s+/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

    