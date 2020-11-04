import { StyleSheet } from 'react-native'

export const pub_style = StyleSheet.create({
    button: {},
})

export const pub_sty_btn = (type: string) => {
    /** 背景颜色 */
    let bgclr = '#66ccff'
    /** 边框颜色 */
    let brclr = '#1592d1'
    switch (type) {
        case 'common':
            bgclr = '#ffffff'
            break

        default:
            break
    }
    return StyleSheet.create({
        box: {
            borderRadius: 4,
            borderColor: brclr,
            borderWidth: 1,
            width: 100,
            height: 40,
            backgroundColor: bgclr,
            textAlign: 'center',
        },
        txt: {
            lineHeight: 40,
            fontSize: 16,
            textAlign: 'center',
        },
    })
}
