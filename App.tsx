/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import 'react-native-get-random-values';
import '@ethersproject/shims';

import {ethers} from 'ethers';
// import {v4 as uuid} from 'uuid';

const provider = new ethers.providers.JsonRpcProvider();

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [walletAddress, setWalletAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [balance, setBalance] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [valueToSend, setValueToSend] = useState('');

  const createWallet = async () => {
    const wallet = await ethers.Wallet.createRandom();
    Alert.alert('Save these words', wallet.mnemonic.phrase);
    const newWallet = await new ethers.Wallet(wallet.privateKey, provider);
    setWalletAddress(newWallet.address.toString());
    setPrivateKey(newWallet.privateKey);
    console.log('wallet', newWallet.address);
  };

  const getBalance = async () => {
    const newBalance = await provider.getBalance(walletAddress);
    setBalance(ethers.utils.formatEther(newBalance));
    console.log('balance', balance);
  };

  const sendTransaction = async () => {
    const gasPrice = provider.getGasPrice();
    let gas_limit = '0x100000';
    const tx = {
      from: walletAddress,
      to: toAddress,
      value: ethers.utils.parseEther(valueToSend),
      nonce: provider.getTransactionCount(walletAddress, 'latest'),
      gasLimit: ethers.utils.hexlify(gas_limit),
      gasPrice: gasPrice,
    };

    let newWallet = new ethers.Wallet(privateKey);
    let walletSigner = newWallet.connect(provider);

    walletSigner.sendTransaction(tx).then(async tx => {
      console.log(tx);
      Alert.alert('Transaction sent');
      getBalance();
    });
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Button
              title="Create Wallet"
              onPress={() => {
                createWallet();
              }}
            />
            {/* <Section title="DID">{uuid()}</Section> */}

            <Section title="Wallet Address">{walletAddress || ''}</Section>
            {/* <Section title="Private Key">{privateKey || ''}</Section> */}
            <Section title="Balance">{balance || 0}</Section>
            <Button title="Get Balance" onPress={() => getBalance()} />
            <Text style={styles.text}>Send to address: </Text>
            <TextInput
              clearButtonMode="always"
              onChangeText={e => setToAddress(e)}
              style={styles.textInputAddress}
            />
            <Text style={styles.text}>Amount to send:</Text>
            <TextInput
              keyboardType="numeric"
              clearButtonMode="always"
              onChangeText={e => setValueToSend(e)}
              style={styles.textInputAmount}
            />
            <Button
              title="Send"
              onPress={() => {
                sendTransaction();
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  textInputAddress: {
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
    padding: 5,
  },
  textInputAmount: {
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
  },
  text: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30,
  },
});

export default App;
