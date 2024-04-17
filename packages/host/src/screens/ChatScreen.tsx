import {Federated} from '@callstack/repack/client';
import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Placeholder from '../components/Placeholder';

const Chat = React.lazy(() => Federated.importModule('chat', './App'));

const ChatScreen = () => {
  return (
    <ErrorBoundary name="ChatScreen">
      <React.Suspense fallback={<Placeholder label="Chat" icon="chat" />}>
        <Chat />
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default ChatScreen;
