import '@mantine/core/styles.css';
import { Flex, MantineProvider } from '@mantine/core';
import { theme, resolver } from './theme';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import { startResourceTimer } from './utils/resetTimer';
import Navbar from './components/Navbar';
import Content from './components/Content';
import Subregion from './components/Subregion';
import Overview from './components/Overview';
import Home from './components/Home';

export default function App() {
  useEffect(() => {
    startResourceTimer();
  }, []);

  return (
    <BrowserRouter basename='/Dijiang-Nexus/'>
      <MantineProvider
        defaultColorScheme='dark'
        theme={theme}
        cssVariablesResolver={resolver}
      >
        <Flex direction={'row'} h={'100vh'} style={{ overflow: 'hidden' }}>
          <Navbar />
          <Content>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/regions' element={<Overview />} />
              <Route
                path='/regions/:region/:subregion'
                element={<Subregion />}
              />
              <Route path='*' element={<Navigate to='/regions' replace />} />
            </Routes>
          </Content>
        </Flex>
      </MantineProvider>
    </BrowserRouter>
  );
}
