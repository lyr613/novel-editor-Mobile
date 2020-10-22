type l1 = 'edit' | 'home'

type l2edit = 'a' | 'b'
/**
 *
 * @param l1
 */
export function mk_router(l1: 'home'): string
export function mk_router(l1: 'edit'): string
export function mk_router(l1: l1, l2?: string): string {
    return l1
}
