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
      console.log(data_input)
      try {
        const res = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: `Be concise, but not too concise, Given the following nutrients, between real and the required ,and fertilizer  try to justify if its the correct fertilizer recommended '
          The fertilizer recommended:${data_input["data"]["fertilizer"]["fertilzer"]}
          the description of the fertilizer:${data_input["data"]["fertilizer"]["description"]}

          the real values are: 
          Nitrogen:${data_input["data"]["real values"]["Nitrogen"]}
          Phosphorus:${data_input["data"]["real values"]["Phosphorus"]}
          Potassium:${data_input["data"]["real values"]["Potassium"]}
          ph:${data_input["data"]["real values"]["ph"]}
          bulk density: ${data_input["data"]["real values"]["bulk_density"]}
          
          the required values are:
          Nitrogen:${data_input["data"]["required values"]["nitrogen"]}
          Phosphorus:${data_input["data"]["required values"]["phosphorus"]}
          Potassium:${data_input["data"]["required values"]["potassium"]}
          ph:${data_input["data"]["required values"]["pH"]}
          bulk density: ${data_input["data"]["required values"]["bulk_density"]}
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
