import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Realm from '../models/Guest';

const GuestListScreen = ({ navigation }) => {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    const realm = Realm;
    const allGuests = realm.objects('Guest');
    setGuests([...allGuests]);

    // Atualiza a lista quando houver mudanças
    const listener = () => {
      setGuests([...realm.objects('Guest')]);
    };
    realm.addListener('change', listener);

    return () => {
      realm.removeListener('change', listener);
    };
  }, []);

  const checkInGuest = (guest) => {
    const realm = Realm;
    realm.write(() => {
      guest.present = true; // Marca como presente
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.guestName}>{item.name}</Text>
      <Text style={styles.guestStatus}>
        {item.present ? 'Presente' : 'Ausente'}
      </Text>
      {!item.present && (
        <TouchableOpacity
          style={styles.checkInButton}
          onPress={() => checkInGuest(item)}
        >
          <Text style={styles.checkInText}>Check-in</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        title="Adicionar Convidado"
        onPress={() => navigation.navigate('AddGuest')}
      />
      <FlatList
        data={guests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  guestName: {
    flex: 1,
    fontSize: 16,
  },
  guestStatus: {
    marginRight: 16,
    fontSize: 16,
    color: '#666',
  },
  checkInButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  checkInText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GuestListScreen;
