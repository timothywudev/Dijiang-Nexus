type Props = {
  children: React.ReactNode;
};

export default function Main({ children }: Readonly<Props>) {
  return <div style={{ overflowY: 'auto', flex: 1 }}>{children}</div>;
}
