type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

interface RequestOptions {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: BodyInit;
}

class RequestBuilder {
  private method: HttpMethod = 'GET';
  private headers: Record<string, string> = {};
  private body?: BodyInit;
  private url: string = '';

  /**
   * Устанавливает метод запроса
   */
  setMethod(method: HttpMethod): this {
    this.method = method;
    return this;
  }

  /**
   * Устанавливает URL запроса
   */
  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  /**
   * Добавляет заголовок
   */
  addHeader(name: string, value: string): this {
    this.headers[name] = value;
    return this;
  }

  /**
   * Устанавливает несколько заголовков
   */
  setHeaders(headers: Record<string, string>): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  /**
   * Устанавливает тело запроса (для POST, PUT и т.д.)
   */
  setBody(body: BodyInit): this {
    this.body = body;
    return this;
  }

  /**
   * Устанавливает JSON тело запроса
   */
  setJsonBody(data: any): this {
    this.body = JSON.stringify(data);
    this.addHeader('Content-Type', 'application/json');
    return this;
  }


  /**
   * Выполняет запрос
   */
  async exec<T = any>(): Promise<T> {
    if (!this.url) {
      throw new Error('URL is required');
    }

    const options: RequestOptions = {
      method: this.method,
      headers: this.headers,
    };

    if (this.body && this.method !== 'GET' && this.method !== 'HEAD') {
      options.body = this.body;
    }

    try {
      const response = await fetch(this.url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        return await response.json() as T;
      } else {
        return await response.text() as unknown as T;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
}
