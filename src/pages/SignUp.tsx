import { useEffect } from 'react';

export function SignUp() {
  useEffect(() => {
    window.location.href = '/api/login';
  }, []);
  return null;
}
