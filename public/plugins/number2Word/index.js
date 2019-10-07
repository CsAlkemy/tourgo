"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var mathjs = require("mathjs");
var ZERO_TO_NINETEEN_MAP = [
	'zero',
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
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
var TWENTY_TO_NINETY_MAP = {
	'20': 'twenty',
	'30': 'thirty',
	'40': 'forty',
	'50': 'fifty',
	'60': 'sixty',
	'70': 'seventy',
	'80': 'eighty',
	'90': 'ninety',
};
var ILLIONS = [
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
	'undecillion',
	'duodecillion',
	'tredecillion',
	'quattuordecillion',
	'quindecillion',
	'sexdecillion',
	'septendecillion',
	'octodecillion',
	'novemdecillion',
	'vigintillion',
	'unvigintillion',
	'dovigintillion',
	'trevigintillion',
	'quattuorvigintillion',
	'quinvigintillion',
	'sexvigintillion',
	'septenvigintillion',
	'octovigintillion',
	'novemvigintillion',
	'trigintillion',
	'untrigintillion',
	'dotrigintillion',
	'tretrigintillion',
	'quattuortrigintillion',
	'quintrigintillion',
	'sextrigintillion',
	'septentrigintillion',
	'octotrigintillion',
	'novemtrigintillion',
];

function isBlank(value) {
	return (/^\s*$/).test(makeString(value));
}

function isNumeric(value) {
	return !isNaN(parseFloat(value)) && isFinite(value);
}

function isString(value) {
	return (typeof (value) === 'string');
}

function eachSlice(value, size, callback) {
	if (size === void 0) {
		size = 1;
	}
	for (var i = 0, l = value.length; i < l; i += size) {
		callback(value.slice(i, i + size));
	}
}

function last(value) {
	return value ? value[value.length - 1] : undefined;
}

function makeString(value) {
	if (value == null)
		return '';
	return '' + value;
}

function numberToNonExponentString(value) {
	var _a;
	var str = (value || 0).toString();
	var exponentialNotation = str.match(/e([\+\-]?)/);
	if (exponentialNotation) {
		var exponentialNotationCapture = exponentialNotation[0];
		var exponentialParts = str.split(exponentialNotationCapture).slice(0, 2);
		var normalizedSignificand = exponentialParts[0];
		var exponent = parseInt(exponentialParts[1], 10);
		var numberParts = normalizedSignificand.split('.').slice(0, 2);
		var integerPart = '', fractionalPart = '';
		integerPart = numberParts[0], _a = numberParts[1], fractionalPart = _a === void 0 ? '' : _a;
		fractionalPart = fractionalPart.replace(/0+$/g, '');
		if (exponentialNotationCapture === 'e-') {
			str = '0.' + repeat('0', exponent - 1) + integerPart + fractionalPart;
		} else {
			str = (integerPart === '0' ? '' : integerPart) + fractionalPart + repeat('0', exponent - fractionalPart.length);
		}
	}
	return str;
}

function parseBigOrZero(value) {
	// console.log('parseBigOrZero value: ', value);
	var result = mathjs.bignumber(isNumeric(value) ? value : 0.0);
	// console.log('parseBigOrZero result: ', result);
	return result;
}

function parseZeroPaddedInt(value) {
	if (isBlank(value) || value === 0 || value === '0' || isBlank(value.toString().replace(/0/g, ''))) {
		return 0;
	}
	value = value.toString();
	var firstNonZeroIndex = value.search(/(?!0)/);
	return parseInt(value.slice(firstNonZeroIndex, value.length), 10);
}

function repeat(str, count) {
	var step, result = '';
	for (step = 0; step < count; step++) {
		result += str;
	}
	return result;
}

function numberToWords(value) {
	var _a;
	var words = [], str, numberParts, integerPart = '', fractionalPart = '', sign = '';
	if (typeof (value) === 'number') {
		str = parseBigOrZero(value).toString().replace(/^\s+$/gm, '');
	} else {
		str = mathjs.bignumber(makeString(value).replace(/^\s+|\s+$/gm, '').replace(/\$|\%|\,|\_/g, '')).toString();
	}
	sign = str.match(/^\-/) ? 'negative ' : '';
	if (sign) {
		str = str.replace(/^\-/, '');
	}
	numberParts = numberToNonExponentString(str).split('.').slice(0, 2);
	integerPart = numberParts[0], _a = numberParts[1], fractionalPart = _a === void 0 ? '' : _a;
	fractionalPart = fractionalPart.replace(/0+$/g, '');
	[integerPart, fractionalPart].forEach(function (numberPart, numberPartIndex) {
		if (!numberPart || numberPart.length === 0)
			return;
		var isFractionalPart = numberPartIndex === 1;
		if (isFractionalPart && fractionalPart.length > 0)
			words.push('and');
		if (!isFractionalPart && parseZeroPaddedInt(numberPart) === 0) {
			words.push('zero');
		} else if (isFractionalPart && parseZeroPaddedInt(numberPart) === 0) {
			// do nothing
		} else {
			var modulo = 3;
			var numberPartRemainder = numberPart.length % modulo;
			var numberZerosToAdd = (numberPartRemainder === 0 ? 0 : modulo - numberPartRemainder);
			var zeros = repeat('0', numberZerosToAdd);
			numberPart = (isFractionalPart ? (numberPart + zeros) : (zeros + numberPart));
			var index_1 = 0;
			var sliceCount = Math.floor(numberPart.length / 3);
			var lastIndex_1 = sliceCount - 1;
			var splitNumberPart = numberPart.split('');
			eachSlice(splitNumberPart, 3, function (numberPiece) {
				var number = parseZeroPaddedInt(numberPiece.join(''));
				var hundreds = Math.floor(number / 100);
				var tens = Math.floor((number - (hundreds * 100)) / 10);
				var ones = Math.floor((number - (hundreds * 100) - (tens * 10)));
				// let ones = parseZeroPaddedInt(number.toString().substr(number.toString().length - 1));
				if (isFractionalPart && fractionalPart.length === 1) {
					words.push(ZERO_TO_NINETEEN_MAP[hundreds]);
					words.push((words[words.length - 2] === 'and' && last(words) === 'one') ?
						'tenth' : 'tenths');
				} else if (isFractionalPart && fractionalPart.length === 2) {
					if (hundreds < 2 && (hundreds > 0 || tens > 0)) {
						words.push(ZERO_TO_NINETEEN_MAP[10 * hundreds + tens]);
					} else if (hundreds >= 2) {
						words.push(TWENTY_TO_NINETY_MAP[hundreds * 10]);
						if (tens > 0)
							words.push(ZERO_TO_NINETEEN_MAP[tens]);
					}
					words.push((words[words.length - 2] === 'and' && last(words) === 'one') ?
						'one-hundreth' : 'one-hundreths');
				} else {
					if (hundreds > 0) {
						words.push(ZERO_TO_NINETEEN_MAP[hundreds], 'hundred');
					}
					if (tens < 2 && (tens > 0 || ones > 0)) {
						words.push(ZERO_TO_NINETEEN_MAP[10 * tens + ones]);
					} else if (tens >= 2) {
						words.push(TWENTY_TO_NINETY_MAP[tens * 10]);
						if (ones > 0)
							words.push(ZERO_TO_NINETEEN_MAP[ones]);
					}
				}
				if (!((index_1 === lastIndex_1) || (number === 0))) {
					words.push(ILLIONS[(lastIndex_1 - index_1) - 1]);
				}
				index_1 += 1;
			});
			if (isFractionalPart && fractionalPart.length > 2) {
				var illion = ILLIONS[Math.floor(numberPart.length / 3) - 1];
				words.push('one-' + illion +
					((words[words.length - 2] === 'and' && last(words) === 'one') ? 'th' : 'ths'));
			}
		}
	});
	return sign + words.join(' ');
}

exports.numberToWords = numberToWords;
