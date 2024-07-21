// components/OpenAIChat.js
import { Button, Center, Loader } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm';

const OpenAIChat = (data_input:any) => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const isLargeScreen = useMediaQuery(`(min-width: 644px)`);

  useEffect(() => {
    const fetchOpenAIResponse = async () => {
     
      setLoading(true);
      try {
        const res = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: `Be concise, but not too concise, Given the following nutrients, between real and the required , try to provide a description, '
          The crop:${data_input["data"]["crop"]}
          the real values are: 
          Nitrogen:${data_input["data"]["real values"]["Nitrogen"]}
          Phosphorus:${data_input["data"]["real values"]["Phosphorus"]}
          Potassium:${data_input["data"]["real values"]["Potassium"]}
          ph:${data_input["data"]["real values"]["ph"]}
          
          
          the required values are:
          Nitrogen:${data_input["data"]["required values"]["nitrogen"]}
          Phosphorus:${data_input["data"]["required values"]["phosphorus"]}
          Potassium:${data_input["data"]["required values"]["potassium"]}
          ph:${data_input["data"]["required values"]["pH"]}
        
          ` }), // Predefined prompt
        });

        const data = await res.json();
        setResponse(data.response);
      } catch (error) {
        console.error('Error fetching data from OpenAI API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenAIResponse();
  }, []);

  return (
    <div>
      {loading ? (
       <> <Center  >
      <Loader color="lime" type="bars" />

     </Center></>
      ) : (
        response && (
          <div>
            <Markdown remarkPlugins={[remarkGfm]}>{response}</Markdown>
          </div>
        )
      )}
     
    </div>
  );
};

export default OpenAIChat;
