import { plural } from "./common";

const Validation = {
	getMinMaxSymbolText(num: number): string {
		return plural(num, ['символ', 'символа', 'символов']);
	},
	validateRequired(value: string, name: string): string[] {
		return this.validateRegExp(value, /^.+$/, `Не заполнено поле ${name}`);
	},
	validateMin(value: string, min: number): string[]   {
		const isValid = value.length >= min;
		return isValid ? [] : [`Должно быть минимум ${min} ${this.getMinMaxSymbolText(min)}`];
	},
	validateMax(value: string, max: number): string[]   {
		const isValid = value.length <= max;
		return isValid ? [] : [`Должно быть максимум ${max} ${this.getMinMaxSymbolText(max)}`];
	},
	validateRegExp(value: string, exp: RegExp, message: string): string[] {
		const isValid = exp.test(value || '');
		return isValid ? [] : [message];
	},
	validateLogin(value: string): string[] {
		let result = this.validateRequired(value, 'Логин');
		result = result.concat(this.validateRegExp(value, /^[a-zA-Z0-9\-_]*$/, 'Латиница или цифры (допустимо нижнее подчеркивание или дефис)'));
		result = result.concat(this.validateRegExp(value, /\d\D|\D\d|\D|^$/, 'Логин не может состоять из одних цифр'));
		result = result.concat(this.validateMin(value, 3));
		result = result.concat(this.validateMax(value, 20));
		return result;
	},
	validateName(value: string, name: string): string[] {
		let result = this.validateRequired(value, name);
		result = result.concat(this.validateRegExp(value, /^[A-ZА-Я][a-zA-Zа-яА-Я-]*$/, 'Допустимы латиница или кириллица с заглавной буквы (возможно использовать дефис)'));
		return result;
	},
	validatePassword(value: string): string[] {
		let result = this.validateRequired(value, 'Пароль');
		result = result.concat(this.validateRegExp(value, /^[a-zA-Z0-9\-_]*$/, 'Допустимы латиница, цифры, нижнее подчеркивание или дефис)'));
		result = result.concat(this.validateRegExp(value, /[A-ZА-Я]/, 'Должна быть хотя бы одна заглавная буква'));
		result = result.concat(this.validateRegExp(value, /\d*/, 'Должна быть хотя бы одна цифра'));
		result = result.concat(this.validateMin(value, 8));
		result = result.concat(this.validateMax(value, 40));
		return result;
	},
	validatePhone(value: string): string[] {
		let result = this.validateRequired(value, 'Телефон');
		result = result.concat(this.validateRegExp(value, /^\+?\d*$/, 'Телефон должен состоять из цифр'));
		result = result.concat(this.validateMin(value, 10));
		result = result.concat(this.validateMax(value, 15));
		return result;
	},
	validateEmail(value: string): string[] {
		let result = this.validateRequired(value, 'Email');
		result = result.concat(this.validateRegExp(value, /^(\w|-)+@(\w|-)+\.\w+$/, 'Невалидный email'));
		return result;
	},
};

export default Validation;
