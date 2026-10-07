import { shallowRef, ref, nextTick } from 'vue';
import { trackEvent } from '../lib/analytics.js';

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/** Shared by the legacy contact panel and the Phase 05 conversation form: same endpoint, states, focus and analytics. */
export function useContactForm() {
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || '';
  const state = shallowRef('idle'); // idle | loading | success | error
  const successMessage = ref(null);
  const nameInput = ref(null);

  async function handleSubmit(event) {
    const form = event.currentTarget;
    if (state.value === 'loading') return;
    state.value = 'loading';
    const data = new FormData(form);
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
      const json = await response.json();
      if (response.ok && json.success) {
        state.value = 'success';
        trackEvent('contact_form_submit', { page_location: window.location.pathname, placement: 'contacto', form_name: 'Formulario de contacto' });
        form.reset();
        await nextTick();
        successMessage.value?.focus();
      } else state.value = 'error';
    } catch {
      state.value = 'error';
    }
  }

  async function resetForm() {
    state.value = 'idle';
    await nextTick();
    nameInput.value?.focus();
  }

  return { accessKey, state, successMessage, nameInput, handleSubmit, resetForm };
}
