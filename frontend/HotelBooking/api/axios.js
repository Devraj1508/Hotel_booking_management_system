import axios from 'axios';
import { env } from '../src/config/env.js';

export const api = axios.create({
  baseURL: env.apiBaseUrl.replace(/\/+$/, ''),
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});
