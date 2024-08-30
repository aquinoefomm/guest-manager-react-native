import React, { useEffect, useState } from 'react';
import { ScrollView, View, Modal, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import Realm from '../models/Guest';
import { styles } from '../styles';
import { TextInput } from 'react-native-gesture-handler';

const GuestListScreen = ({ navigation }) => {
  const [guests, setGuests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false)
  const [guestsTotal, setGuestsTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const realm = Realm;
    const allGuests = realm.objects('Guest');
    setGuests([...allGuests].sort());

    // Atualiza a lista quando houver mudanças
    const listener = () => {
      setGuests([...realm.objects('Guest')]);
      setGuestsTotal(allGuests.length);
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



  const renderItem = ({ item }) => {
    const isHighlighted = searchQuery && item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return (
      <View style={[styles.item, isHighlighted && styles.highlight]}>
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
  }

  return (
    <ScrollView style={styles.container}>

      <Button
        title="Adicionar Convidado"
        onPress={() => navigation.navigate('AddGuest')}
      />
      <View style={styles.container}>
        <Text style={styles.label}>Número de convidados: {guestsTotal}</Text>
      </View>
      <View style={styles.container}>
        <TextInput 
          style={styles.searchBox}
          placeholder='Digite sua busca'
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />

      
      </View>
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
