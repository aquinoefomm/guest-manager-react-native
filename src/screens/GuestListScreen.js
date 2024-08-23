import React, { useEffect, useState } from 'react';
import { ScrollView, View, Modal, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Realm from '../models/Guest';
import { styles } from '../styles';

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
    <ScrollView style={styles.container}>

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

    </ScrollView>
  );
};

export default GuestListScreen;
