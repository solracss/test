window.addEventListener("load", () => {
	const form = document.getElementById("validator");
	form.addEventListener("submit", handleValidation);
});

function handleValidation(event) {
	event.preventDefault();
	const inputElement = document.getElementById("creditCardNumberInput");
	const isValid = runLuhnAlgorithm(inputElement.value);
	inputElement.style.backgroundColor = isValid ? "#D6F3E9" : "#FDE1E1";
	const issuer = document.getElementById("issuer");
	issuer.innerText = checkCardCompany(inputElement.value);
	const passLuhn = document.getElementById("passLuhn");
	passLuhn.innerText = isValid ? "pass" : "fail";
	passLuhn.style.color = isValid ? "#34c38f" : "#f46a6a";
}

// logic

function runLuhnAlgorithm(numberStr) {
	numberStr = numberStr.replace(/\s+/g, "");
	if (!/^\d+$/.test(numberStr)) {
		return false;
	}
	const numberArr = stringNumberToArray(numberStr);
	const lastElement = BigInt(numberArr.pop());
	const sumOfDigits = sumDigitsInNumber(doubleEveryOtherNumber(numberArr)) + lastElement;
	return sumOfDigits % 10n === 0n;
}

function checkCardCompany(cardNumber) {
	cardNumber = cardNumber.replace(/\s+/g, "");
	switch (true) {
		case /^3[47]\d{13}$/.test(cardNumber):
			return "American Express";
		case /^30[012345]\d{11}$|^36\d{12}$/.test(cardNumber):
			return "Diners Club";
		case /^6(011|22(126|925)|(4)[4-9]|5)\d{10,14}/.test(cardNumber):
			return "Discover";
		case /^63[789]\d{13}$/.test(cardNumber):
			return "InstaPayment";
		case /^35(2[8-9]|[3-8][0-9])\d{12,15}$/.test(cardNumber):
			return "JCB";
		case /(^(5((0(18|20|38))|(893)))|^(6(304|7(59|6[123]))))\d{12,15}$/.test(cardNumber):
			return "Maestro";
		case /^(?:5[1-5]\d{2}|222\d|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}$/.test(cardNumber):
			return "MasterCard";
		case /^4(\d{12}|\d{15}|\d{18})$/.test(cardNumber):
			return "Visa";
		default:
			return "-";
	}
}

// utils

function doubleEveryOtherNumber(numberArr) {
	for (let i = numberArr.length - 1; i >= 0; i -= 2) {
		numberArr[i] *= 2;
		if (numberArr[i] > 9) {
			numberArr[i] = numberArr[i] - 9;
		}
	}

	const bigNumber = BigInt(numberArr.join(""));
	return bigNumber;
}

function stringNumberToArray(string) {
	return string.split("").map(x => parseInt(x));
}

function sumDigitsInNumber(number) {
	let sum = 0n;
	while (number > 0n) {
		let digit = number % 10n;
		sum += digit;
		number = number / 10n;
	}

	return sum;
}
