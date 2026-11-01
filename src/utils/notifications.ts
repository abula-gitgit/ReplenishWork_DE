import { CalculatedItem } from '../types/consumable';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function isServiceWorkerSupported(): boolean {
  return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Service Worker Registrierung für PWA und Push-Erinnerungen
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    
    if ('periodicSync' in registration) {
      try {
        const periodicSync = (registration as any).periodicSync;
        const tags = await periodicSync.getTags();
        if (!tags.includes('replenish-check-reminder')) {
          await periodicSync.register('replenish-check-reminder', {
            minInterval: 24 * 60 * 60 * 1000
          });
        }
      } catch (err) {
        // Stille Ignorierung falls Browser keine periodische Synchro unterstützt
      }
    }

    return registration;
  } catch (err) {
    console.error('Fehler bei der Registrierung des Service Workers:', err);
    return null;
  }
}

/**
 * Erlaubnis für Desktop-/Browser-Benachrichtigungen anfordern
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await registerServiceWorker();
    }
    return permission;
  } catch (err) {
    console.error('Fehler bei der Benachrichtigungsanfrage:', err);
    return 'denied';
  }
}

/**
 * Testbenachrichtigung senden
 */
export async function sendTestNotification(): Promise<boolean> {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    if (isServiceWorkerSupported() && navigator.serviceWorker.controller) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification('Replenish for Work - Testbenachrichtigung', {
        body: 'Benachrichtigungen sind aktiv! Sie erhalten rechtzeitig Hinweise vor Wechsel- und Nachbestellfristen.',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'replenish-test-notification'
      });
      return true;
    }

    new Notification('Replenish for Work - Testbenachrichtigung', {
      body: 'Benachrichtigungen sind aktiv! Sie erhalten rechtzeitig Hinweise vor Wechsel- und Nachbestellfristen.',
      icon: '/icon-192.png',
      tag: 'replenish-test-notification'
    });
    return true;
  } catch (err) {
    console.error('Fehler beim Senden der Testbenachrichtigung:', err);
    return false;
  }
}

/**
 * Dringende Benachrichtigung für überfällige und nachzubestellende Artikel
 */
export async function checkAndNotifyUrgentItems(urgentItems: CalculatedItem[]): Promise<boolean> {
  if (!isNotificationSupported() || Notification.permission !== 'granted' || urgentItems.length === 0) {
    return false;
  }

  const overdue = urgentItems.filter((i) => i.status === 'overdue');
  const today = urgentItems.filter((i) => i.status === 'today');
  const buySoon = urgentItems.filter((i) => i.status === 'buy_soon');

  let title = '';
  let body = '';

  if (overdue.length > 0) {
    title = `Replenish for Work: ${overdue.length} Artikel überfällig`;
    body = `Dringender Austausch für: ${overdue.map((i) => i.name).slice(0, 2).join(', ')}${overdue.length > 2 ? ` und ${overdue.length - 2} weitere` : ''}.`;
  } else if (today.length > 0) {
    title = `Replenish for Work: ${today.length} Wechsel heute fällig`;
    body = `Heute fällig: ${today.map((i) => i.name).slice(0, 2).join(', ')}${today.length > 2 ? ` und ${today.length - 2} weitere` : ''}.`;
  } else if (buySoon.length > 0) {
    title = `Replenish for Work: ${buySoon.length} Nachbestellungen beachten`;
    body = `Vorlaufzeit prüfen für: ${buySoon.map((i) => i.name).slice(0, 2).join(', ')}${buySoon.length > 2 ? ` und ${buySoon.length - 2} weitere` : ''}.`;
  } else {
    return false;
  }

  try {
    if (isServiceWorkerSupported() && navigator.serviceWorker.controller) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'replenish-urgent-alert'
      });
      return true;
    }

    new Notification(title, {
      body,
      icon: '/icon-192.png',
      tag: 'replenish-urgent-alert'
    });
    return true;
  } catch (err) {
    console.error('Fehler beim Auslösen der Arbeitsplatzbenachrichtigung:', err);
    return false;
  }
}

export const notifyUrgentItems = checkAndNotifyUrgentItems;

