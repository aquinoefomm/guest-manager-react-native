import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Realm from '../models/Guest';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 18,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default AddGuestScreen;
