import type { NextPage } from 'next'
import Head from 'next/head'
import { VStack, HStack, Heading, Text, Button, Input, Box, Spacer, Spinner } from '@chakra-ui/react'
import React from 'react'
import { load } from '../src/funcs';

const Home: NextPage = () => {
  const [input, setInput] = React.useState<string>('');
  const [refresh, setRefresh] = React.useState<boolean>(true);
  const [addressAccount, setAddresAccount] = React.useState<any>(null);
  const [contract, setContract] = React.useState<any>(null);
  const [tasks, setTasks] = React.useState<any[]>([]);

  

  // Handlers

  const handleInputChange = (e:any) => setInput(e.currentTarget.value);
  const handleAddTask = async () => {
    await contract.createTask(input, {from: addressAccount});
    setInput('');
    setRefresh(true);
  };
  const handleToggled = async (id: number) => {
    await contract.toggleCompleted(id, {from: addressAccount});
    setRefresh(true);
  };
  const handleAccountsChanged = async () => {
    setRefresh(true);
  };
  // React useEffect

  const shortenAddress = (address:string) => {
    if (!address) return '';
    const prefix = address.slice(0, 6);
    const suffix = address.slice(-2);
    return `${prefix}....${suffix}`;
};
  React.useEffect(() => {
    if (!refresh) return;
    setRefresh(false);
    load().then((e) => {
      setAddresAccount(e.addressAccount);
      setTasks(e.tasks);
      setContract(e.todoContract);
    });
  });

  return (
    <VStack>
        <Head>
          <title>Todo List</title>
          <meta name="description" content="Blockchain TodoList." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <HStack w='full'>
          <Spacer />
          <VStack>
            <Heading>Blockchain TodoList</Heading>
            <Box h='30px'/>
            <HStack w='md'>
              <Input
              type='text'
              size='md'
              placeholder='New Task...'
              onChange={handleInputChange}
              value={input}
              />
              <Button onClick={handleAddTask} bg='green.200'>ADD</Button>
              <Button onClick={handleAccountsChanged} bg='red.100'>Reload</Button>
            </HStack>
            <Box h='30px' />
            <Text>{shortenAddress(addressAccount)}</Text>
            <Text>ToDo</Text>
            {
              tasks == null ? <Spinner />
              : tasks.map((task, idx) => !task[2] ?
              <HStack key={idx} w='md' bg='gray.100' borderRadius={7}>
                <Box w='5px' />
                <Text>{task[1]}</Text>
                <Spacer />
                <Button bg='green.300' onClick={ () => handleToggled(task[0].toNumber()) }>DONE</Button>
              </HStack> : null
              )
            }
            <Box h='10px' />
            <Text>Tasks done</Text>
            {
              tasks == null ? <Spinner /> :
              tasks.map((task, idx) => task[2] ?
              <HStack key={idx} w='md' bg='gray.100' borderRadius={7}>
                <Box w='5px' />
                <Text>{task[1]}</Text>
                <Spacer />
                <Button bg='red.300' onClick={ () => handleToggled(task[0].toNumber() ) }>UNDONE</Button>
              </HStack> : null
              )
            }
          </VStack>
          <Spacer />
        </HStack>
    </VStack>
  )
}

export default Home