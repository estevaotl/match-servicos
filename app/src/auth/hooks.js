import { useEffect, useRef, useState } from 'react';
import { authenticate } from './data';

export function useAuthSubmission() {
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const busy = useRef(false);
  const active = useRef(true);
  const controller = useRef(null);
  useEffect(() => { active.current = true; return () => { active.current = false; controller.current?.abort(); }; }, []);
  async function submit(action, payload, onSuccess) {
    if (busy.current) return;
    busy.current = true; setSubmitting(true); setServerErrors([]);
    controller.current = new AbortController();
    const timeout = setTimeout(() => controller.current.abort(), 15000);
    try {
      const session = await authenticate(action, payload, controller.current.signal);
      if (active.current) onSuccess(session);
    } catch (error) {
      if (active.current) setServerErrors(error.messages || [error.message]);
    } finally {
      clearTimeout(timeout); busy.current = false;
      if (active.current) setSubmitting(false);
    }
  }
  return { submitting, serverErrors, submit, clearServerErrors: () => setServerErrors([]) };
}
