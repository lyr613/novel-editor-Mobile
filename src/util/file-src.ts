import RNFS from 'react-native-fs'

export function mk_file_src(rest: string[]) {
    const r = rest.join('/')
    return RNFS.DocumentDirectoryPath + '/books/' + r
}
