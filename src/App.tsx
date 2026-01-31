import '@mantine/core/styles.css';
import { theme, resolver } from './theme';
import { MantineProvider } from '@mantine/core';
import Shell from './components/Shell';

export default function App() {
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
