import { useAppState } from '@/state/AppStateContext';
import {
  formatAppDate,
  translate,
  type TranslationKey,
} from './translations';

export function useTranslation() {
  const { language } = useAppState();

  return {
    language,
    t: (key: TranslationKey, params?: Record<string, string | number>) => translate(language, key, params),
    formatDate: (value: Date | string, options: Intl.DateTimeFormatOptions) => formatAppDate(value, language, options),
  };
}
