import { AsyncStorage } from 'react-native'


export async function getStyles() {
    let styles = await getStoragedStyles()
    return styles
}

/**
|--------------------------------------------------
| Function that returns promise, if styles found asyncstorage
| it will return resolve with style object or throw default style object 
| if @param result is null. Else it will return reject with error
|--------------------------------------------------
*/
function getStoragedStyles() {
    return new Promise((resolve, reject) => {
        try {
            AsyncStorage.getItem('STYLES', (error, result) => {
                if (error) {
                    reject(Error(error))
                }
                if (result !== null) {
                    resolve(JSON.parse(result))
                } else {
                    const styles = {
                        backgroundColor: 'rgb(0, 0 ,0)'
                    }
                    resolve(styles)
                }
            })
        } catch (err) {
            reject(Error(err))
        }
    })
}