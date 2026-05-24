import { useEffect } from 'react';

export function SignIn() {
  useEffect(() => {
    window.location.href = '/api/login';
  }, []);
  return null;
}
