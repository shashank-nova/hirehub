import { useState, useEffect } from 'react';
import { Bell, CheckCircle } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - would connect to API in production
    setNotifications([]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-royal-600"></div>
        <p className="mt-4 text-gray-600">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <button className="btn btn-secondary text-sm">Mark all as read</button>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                !notification.read ? 'border-l-4 border-royal-600' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  !notification.read ? 'bg-royal-100' : 'bg-gray-100'
                }`}>
                  <Bell className={`h-5 w-5 ${
                    !notification.read ? 'text-royal-600' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button className="text-royal-600 hover:text-royal-700">
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
