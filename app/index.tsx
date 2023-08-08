import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAction, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';

const Page = () => {
  const groups = useQuery(api.groups.get) || [];
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const performGetGreetingAction = useAction(api.greeting.getGreeting);
  const [greeting, setGreeting] = useState('');

  // Check if the user has a name, otherwise show modal
  useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem('user');
      if (!user) {
        setTimeout(() => {
          setVisible(true);
        }, 100);
      } else {
        setName(user);
      }
    };
    loadUser();
  }, []);

  // Safe the user name to async storage
  const setUser = async () => {
    let r = (Math.random() + 1).toString(36).substring(7);
    const userName = `${name}#${r}`;
    await AsyncStorage.setItem('user', userName);
    setName(userName);
    setVisible(false);
  };

  // Load greeting using Convex action
  useEffect(() => {
    if (!name) return;
    const loadGreeting = async () => {
      const greeting = await performGetGreetingAction({ name });
      setGreeting(greeting);
    };
    loadGreeting();
  }, [name]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {groups.map((group) => (
          <Link href={{ pathname: '/(chat)/[chatid]', params: { chatid: group._id } }} key={group._id.toString()} asChild>
            <TouchableOpacity style={styles.group}>
              <Image source={{ uri: group.icon_url }} style={{ width: 50, height: 50 }} />
              <View style={{ flex: 1 }}>
                <Text>{group.name}</Text>
                <Text style={{ color: '#888' }}>{group.description}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
        <Text style={{ textAlign: 'center', margin: 10 }}>{greeting}</Text>
      </ScrollView>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Username required</Dialog.Title>
        <Dialog.Description>Please insert a name to start chatting.</Dialog.Description>
        <Dialog.Input onChangeText={setName} />
        <Dialog.Button label="Set name" onPress={setUser} />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F8F5EA',
  },
  group: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default Page;
