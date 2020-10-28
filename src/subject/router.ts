import { Subject } from 'rxjs'

/** 推入以改变路由, 数组会自动处理成字符串 */
export const router_nexter$ = new Subject<string | string[]>()
