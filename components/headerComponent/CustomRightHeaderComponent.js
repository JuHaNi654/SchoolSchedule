import { TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements'
import React from 'react'
const CustomRightHeaderComponent = ( props ) => {

    return(
        <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate('Main')}>
            <Icon name="home" 
                containerStyle={{ paddingBottom: 25 }}
                color='#fff'
                size={35}
                />
        </TouchableWithoutFeedback>
    )
}


export default CustomRightHeaderComponent