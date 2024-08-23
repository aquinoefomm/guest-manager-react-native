import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Realm from '../models/Guest';
import { styles } from '../styles';

const AddGuestScreen = ({ navigation }) => {
  const [name, setName] = useState('');

  const addGuest = () => {
    const realm = Realm;
    realm.write(() => {
      realm.create('Guest', {
        id: new Date().toISOString(),
        name: name,
      });
    });
    setName('');
    navigation.goBack();
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Convidado:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <Button title="Adicionar" onPress={addGuest} />
      
    </View>
  );
};

export default AddGuestScreen;
