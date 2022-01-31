export const plural = (num: number, text_forms: string[]): string => {
	const lastFormCheck = Math.abs(num % 100);
	const firstAndSecondFormCheck = lastFormCheck % 10;
	if (lastFormCheck > 10 && lastFormCheck < 20) {
		return text_forms[2];
	}
	if (firstAndSecondFormCheck > 1 && firstAndSecondFormCheck < 5) {
		return text_forms[1];
	}
	if (firstAndSecondFormCheck === 1) {
		return text_forms[0];
	}
	return text_forms[2];
};
