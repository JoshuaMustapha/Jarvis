'use client'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {Box, Stack, TextField, Button} from '@mui/material'
import Image from "next/image";
import {useState} from 'react'


export default function Home() {

  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hello I'm your, self-admittedly rudimentary, AI Assistant. What can I assist you with today?"
  }])

  const [message, setMessage] = useState('')

  const sendMessage = async()=>{
    setMessage('')
    setMessages((messages)=>[
      ...messages,
      {role: "user", content: message},
      {role: "assistant", content:''}
    ])
    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, {role:'user', content: message}]),
    }).then(async (res)=>{
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function proccessText({done, value}){
        if (done){
          return result
        }
        const text = decoder.decode(value || new Int8Array(), {stream:true})
        setMessages((messages) =>{
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return([
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ])
        })
        return reader.read().then(proccessText)
      })
    })
  }
  const lobsterFont = css`
  @import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
  font-family: 'Lobster', cursive;
`;

  return (
  
  <Box
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    sx={{ backgroundColor:"burlywood"}}
    >
      <Box
      width="100vw"
      height="10vh"
      display="flex"
      flexDirection="row"
      sx={{fontSize: '2rem', fontWeight: 'bold', paddingLeft: '50px', lobsterFont}}
      spacing={3}
      >Bootleg Jarvis</Box>
      <Stack
      direction="column"
      width="1200px"
      height="600px"
      border="3px solid black"
      p={2}
      spacing={3}
      borderRadius={16}
      sx={{ backgroundColor:"lightgray"}}
      >
        <Stack 
        direction="column" 
        spacing={2} 
        flexGrow = {1} 
        overflow = "auto" 
        maxHeight = "100%"
        >
          {
            messages.map((message, index)=> (
              <Box key={index} display = 'flex' justifyContent={
                message.role == "assistant" ? "flex-start": "flex-end"
              }
              >
                <Box 
                bgcolor={
                  message.role === "assistant"
                  ? 'primary.main'
                  : 'secondary.main'
                }
                color="white"
                borderRadius = {16}
                p={3}
              >
                {message.content}
              </Box>
              </Box>
            ))}
        </Stack>
        <Stack
        direction="row"
        spacing={2}
        >
          <TextField
          label = "message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant = "containted" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
  </Box> )
}
