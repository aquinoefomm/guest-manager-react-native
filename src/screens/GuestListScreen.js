import React, { useEffect, useState } from 'react';
import { View, Modal, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Realm from '../models/Guest';

const GuestListScreen = ({ navigation }) => {
  const [guests, setGuests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false)

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

  const clearList = () => {
    const realm = Realm;
    realm.write(() => {
      realm.deleteAll();
    })
  };

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const handlePress = () => showModal();

  const confirmAction = () => {
    clearList()
    hideModal()
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
      <View style={styles.container}>
        <Button title="Limpar Lista" onPress={handlePress} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={hideModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirma limpar a lista?</Text>
              <View>
                <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
                  <Text style={styles.modalText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={confirmAction}>
                  <Text style={styles.modalText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </Modal>
      </View>

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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 5, // Android shadow effect
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default GuestListScreen;
