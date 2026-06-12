import React, { useRef } from 'react';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

export function TawkChat() {
  const tawkMessengerRef = useRef<any>(null);

  const propertyId = import.meta.env.VITE_TAWK_PROPERTY_ID;
  const widgetId = import.meta.env.VITE_TAWK_WIDGET_ID || 'default';

  if (!propertyId) {
    return null; // Tawk is not configured
  }

  return (
    <TawkMessengerReact
      propertyId={propertyId}
      widgetId={widgetId}
      ref={tawkMessengerRef}
      onBeforeLoad={() => {}}
      onStatusChange={() => {}}
      onLoad={() => {}}
      onChatMessageSystem={() => {}}
      onUnreadCountChanged={() => {}}
      onChatMaximized={() => {}}
      onChatMinimized={() => {}}
      onChatMessageVisitor={() => {}}
      onChatStarted={() => {}}
      onChatHidden={() => {}}
      customStyle={{
        zIndex: 99999
      }}
    />
  );
}
