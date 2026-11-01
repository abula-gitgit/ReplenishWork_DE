import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Send, 
  Smartphone
} from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendTestNotification 
} from '../utils/notifications';
import { formatDateDisplay } from '../utils/dateCalc';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  urgentItems: CalculatedItem[];
  onPermissionChange?: (perm: NotificationPermission | 'unsupported') => void;
  onShowToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  urgentItems,
  onPermissionChange,
  onShowToast
}) => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    getNotificationPermission()
  );
  const [isSendingTest, setIsSendingTest] = useState(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setPermission(perm);
    if (onPermissionChange) onPermissionChange(perm);

    if (perm === 'granted') {
      onShowToast('Browser-Benachrichtigungen erfolgreich aktiviert!', 'success');
      await sendTestNotification();
    } else if (perm === 'denied') {
      onShowToast('Benachrichtigungen sind blockiert. Bitte in den Website-Einstellungen der Adressleiste freigeben.', 'error');
    }
  };

  const handleTestNotification = async () => {
    setIsSendingTest(true);
    try {
      const success = await sendTestNotification();
      if (success) {
        onShowToast('Testbenachrichtigung gesendet! Bitte Systemhinweise prüfen.', 'success');
      } else {
        onShowToast('Senden fehlgeschlagen. Bitte Browser-Berechtigung überprüfen.', 'error');
      }
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4 stroke-[2.3]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Benachrichtigungseinstellungen
              </h2>
              <p className="text-xs text-slate-500">
                Erhalten Sie rechtzeitig Hinweise vor Wechsel- und Nachbestellterminen.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4">
          {/* Aktueller Berechtigungsstatus */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-0.5">
                Status der Browser-Berechtigung
              </span>
              <p className="text-[11px] text-slate-500">
                {permission === 'granted'
                  ? 'Erlaubnis erteilt. Automatische Erinnerungen sind aktiv.'
                  : permission === 'denied'
                  ? 'Blockiert. Bitte in den Website-Berechtigungen des Browsers freigeben.'
                  : 'Nicht konfiguriert. Klicken Sie auf Aktivieren für rechtzeitige Fristerinnerungen.'}
              </p>
            </div>

            <div>
              {permission === 'granted' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Aktiv</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                >
                  Aktivieren
                </button>
              )}
            </div>
          </div>

          {/* Testbenachrichtigung senden */}
          {permission === 'granted' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-0.5">
                  Hinweisfunktion testen
                </span>
                <p className="text-[11px] text-slate-500">
                  Sendet sofort eine Testbenachrichtigung an dieses Gerät.
                </p>
              </div>

              <button
                type="button"
                disabled={isSendingTest}
                onClick={handleTestNotification}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Testen</span>
              </button>
            </div>
          )}

          {/* PWA & Tablet-Tipp */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-950 leading-relaxed">
              <span className="font-bold block mb-1">Tipp für Tablets und Dienst-Smartphones</span>
              Fügen Sie Replenish for Work zum Startbildschirm hinzu («Teilen» → «Zum Home-Bildschirm» unter iOS Safari oder «App installieren» unter Android Chrome), um Benachrichtigungen wie in einer nativen App zu empfangen.
            </div>
          </div>

          {/* Aktuell fällige Artikel */}
          {urgentItems.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Dringende Artikel & Fälligkeiten ({urgentItems.length})
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {urgentItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs flex items-center justify-between"
                  >
                    <span className="font-bold text-slate-900 truncate max-w-[240px]">{item.name}</span>
                    <span className="text-[10px] font-bold text-rose-600 shrink-0">
                      {formatDateDisplay(item.nextReplacementDate)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
