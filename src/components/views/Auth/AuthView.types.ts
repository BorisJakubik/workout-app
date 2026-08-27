import type { Language } from '../../../types'
import type { Translate } from '../../molecules/NotesDictation/NotesDictation.types'
export interface AuthCredentials { email: string; password: string }
export interface AuthViewProps { onLogin: (credentials: AuthCredentials) => void; onRegister: (credentials: AuthCredentials) => void; onLanguageChange: () => void; error: string; language: Language; loading: boolean; t: Translate }
