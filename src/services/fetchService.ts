export enum METHODS {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	DELETE = "DELETE",
}

type TOptions<T> = {
	method: METHODS
	headers?: Record<string, string>
	data?: T
	timeout?: number
};

type TMethodOptions<T> = Omit<TOptions<T>, 'method'>;

export type TResponse<T> = {
	status: boolean,
	data: T
};

const DEFAULT_REQUEST_TIMEOUT = 5000;

class FetchService {
	private baseUrl: string;
	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}
	deriveTimeout<T>(options: TMethodOptions<T>): number {
		return options.timeout || DEFAULT_REQUEST_TIMEOUT;
	}
	get<T>(url: string, options: TMethodOptions<T> = {}) {
		return this.request(
			url,
			{ ...options, method: METHODS.GET },
			this.deriveTimeout(options)
		);
	}
	post<T>(url: string, options: TMethodOptions<T> = {}) {
		return this.request(
			url,
			{ ...options, method: METHODS.POST },
			this.deriveTimeout(options)
		);
	}
	put<T>(url: string, options: TMethodOptions<T> = {}) {
		return this.request(
			url,
			{ ...options, method: METHODS.PUT },
			this.deriveTimeout(options)
		);
	}
	delete<T>(url: string, options: TMethodOptions<T> = {}) {
		return this.request(
			url,
			{ ...options, method: METHODS.DELETE },
			this.deriveTimeout(options)
		);
	}
	serializeData<T>(data: T): string {
		try {
			return JSON.stringify(data);
		} catch (err) {
			console.error('Failed to serialize data for request, got error', err);
			return '';
		}
	}
	deserializeData<T>(jsonString: string): T | null {
		try {
			return JSON.parse(jsonString);
		} catch (err) {
			console.error('Failed to deserialize data for request, got error', err);
			return null;
		}
	}
	request<T, U>(url: string, options : TOptions<T> = { method: METHODS.GET }, timeout: number): Promise<TResponse<U | null>> {
		const {method, headers, data} = options;
		const self = this;
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.timeout = timeout;
			let targetUrl = this.baseUrl + url;
			if(method === METHODS.GET && data){
				targetUrl += this.queryStringify(data);
			}
			xhr.open(method, targetUrl);
			headers && Object.keys(headers).forEach((header) => {
				xhr.setRequestHeader(header, headers[header]);
			});

			xhr.onload = function() {
				resolve({
					status: xhr.status === 200,
					data: self.deserializeData(xhr.response),
				});
			};

			xhr.onabort = reject;
			xhr.onerror = reject;
			xhr.ontimeout = reject;

			if (method === METHODS.GET) {
				xhr.send();
			} else {
				xhr.send(this.serializeData(data));
			}
		});
	}
	queryStringify<T extends Record<string, any>>(data: T): string {
		let isFirst = true;
		return data && Object.keys(data).reduce((query, key) => {
			query += (isFirst ? '?' : '&') + `${key}=${String(data[key])}`;
			isFirst = false;
			return query;
		}, '');
	}
}

const fetchService = new FetchService('https://ya-praktikum.tech/api/v2');

export default fetchService;

