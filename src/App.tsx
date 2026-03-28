import { ChatWidget } from 'ajaxter-chat';

export default function App() {
  return (
    <div>
      <main>Your app content</main>

      <ChatWidget
        theme={{
          primaryColor: '#6C63FF',
          buttonColor: '#6C63FF',
          buttonTextColor: '#ffffff',
          buttonLabel: 'Chat with us',
          buttonPosition: 'bottom-right',
          fontFamily: "'DM Sans', sans-serif",
          borderRadius: '16px',
        }}
      />
    </div>
  );
}
