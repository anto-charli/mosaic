import { ChakraProvider } from '@chakra-ui/react'
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  return (
      <ChakraProvider>
        <Component {...pageProps} />;
      </ChakraProvider>
    )
}

export default MyApp;
