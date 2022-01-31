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

const DEFAULT_REQUEST_TIMEOUT = 5000;

const FetchService = {
	deriveTimeout<T>(options: TMethodOptions<T>): number {
		return options.timeout || DEFAULT_REQUEST_TIMEOUT;
	},
	get<T>(url: string, options: TMethodOptions<T> = {}) {
		return this.request(
			url,
			{ ...options, method: METHODS.GET },
			this.deriveTimeout(options)
		);
	},

	post<T>(url: string, options: TMethodOptions<T> = {}) {
		return this.request(
			url,
			{ ...options, method: METHODS.POST },
			this.deriveTimeout(options)
		);
	},

	put<T>(url: string, options: TMethodOptions<T> = {}) {
		return this.request(
			url,
			{ ...options, method: METHODS.PUT },
			this.deriveTimeout(options)
		);
	},

	delete<T>(url: string, options: TMethodOptions<T> = {}) {
		return this.request(
			url,
			{ ...options, method: METHODS.DELETE },
			this.deriveTimeout(options)
		);
	},
	serializeData<T>(data: T): string {
		try {
			return JSON.stringify(data);
		} catch (err) {
			console.error('Failed to serialize data for request, got error', err);
			return '';
		}
	},
	request<T, U>(url: string, options : TOptions<T> = { method: METHODS.GET }, timeout: number): Promise<U> {
		const {method, headers, data} = options;
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.timeout = timeout;
			let targetUrl = url;
			if(method === METHODS.GET && data){
				targetUrl += this.queryStringify(data);
			}
			console.log('targetUrl', targetUrl);
			xhr.open(method, targetUrl);
			headers && Object.keys(headers).forEach((header) => {
				xhr.setRequestHeader(header, headers[header]);
			});

			xhr.onload = function() {
				resolve(xhr.response);
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
	},
	queryStringify<T extends Record<string, any>>(data: T): string {
		let isFirst = true;
		return data && Object.keys(data).reduce((query, key) => {
			query += (isFirst ? '?' : '&') + `${key}=${data[key]}`;
			isFirst = false;
			return query;
		}, '');
	}
};

export default FetchService;

