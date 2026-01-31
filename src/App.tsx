import '@mantine/core/styles.css';
import { theme, resolver } from './theme';
import { MantineProvider } from '@mantine/core';
import Shell from './components/Shell';
import { startResourceTimer } from './utils/resetTimer';

export default function App() {
  startResourceTimer();

  return (
    <MantineProvider
      defaultColorScheme='dark'
      theme={theme}
      cssVariablesResolver={resolver}
    >
      <Shell />
    </MantineProvider>
  );
}
