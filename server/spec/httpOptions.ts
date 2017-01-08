import {CoreOptions} from '@types/request';

export function loginHeader(username: string, password: string): CoreOptions {
  let httpHeader: CoreOptions = {
    form: {username: username, password: password},
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return httpHeader;
}

export function authBearerOptions(token: string, body?: any): CoreOptions {
  let httpHeader: CoreOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  if (body) {
    httpHeader.body = body;
  }
  return httpHeader;
}
