import type { Translate } from '../NotesDictation/NotesDictation.types'

export interface DeleteLibraryItem { id: string; name: string; type: 'category' | 'exercise' }
export interface DeleteLibraryItemModalViewProps { item: DeleteLibraryItem; onCancel: () => void; onDelete: () => void; t: Translate }
