import React from 'react';
import {StyleSheet, Text, StatusBar, View} from 'react-native';
import {useLocalSearchParams} from 'expo-router';

const Details = () => {
    const { id } = useLocalSearchParams();
    return (
        <View>
            <Text>Task id: {id}</Text>
        </View>
    );
}

export default Details;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
    },
    item: {
        backgroundColor: '#c2cfff',
        padding: 20,
        marginVertical: 8,
        borderRadius: 20,
        borderColor: 'black',
    },
    header: {
        fontSize: 32,
        backgroundColor: '#fff',
    },
    title: {
        backgroundColor: '#c2cfff',
        fontSize: 24,
    },
});
