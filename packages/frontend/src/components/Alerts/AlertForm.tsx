import { useState } from 'react';

interface AlertFormProps {
  onSubmit: (alert: any) => void;
}

export const AlertForm = ({ onSubmit }: AlertFormProps) => {
  const [alert, setAlert] = useState({
    type: 'WATCH',
    symbol: '',
    conditions: {
      price: {
        enabled: false,
        value: 0,
        condition: 'ABOVE'
      },
      mentionVelocity: {
        enabled: false,
        value: 0,
        condition: 'ABOVE'
      },
      sentiment: {
        enabled: false,
        value: 0,
        condition: 'ABOVE'
      },
      scamProbability: {
        enabled: false,
        value: 0,
        condition: 'BELOW'
      }
    },
    notifications: {
      email: true,
      telegram: false,
      webhook: ''
    },
    expiresAt: null
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Create Alert</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(alert);
      }}>
        <div className="space-y-4">
          {/* Alert Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alert Type
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={alert.type}
              onChange={(e) => setAlert({ ...alert, type: e.target.value })}
            >
              <option value="WATCH">Watch</option>
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>

          {/* Symbol */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Symbol
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={alert.symbol}
              onChange={(e) => setAlert({ ...alert, symbol: e.target.value })}
            />
          </div>

          {/* Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Conditions</h3>
            
            {/* Price Condition */}
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={alert.conditions.price.enabled}
                onChange={(e) => setAlert({
                  ...alert,
                  conditions: {
                    ...alert.conditions,
                    price: {
                      ...alert.conditions.price,
                      enabled: e.target.checked
                    }
                  }
                })}
              />
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Price"
                  className="rounded-md border-gray-300 shadow-sm"
                  disabled={!alert.conditions.price.enabled}
                  value={alert.conditions.price.value}
                  onChange={(e) => setAlert({
                    ...alert,
                    conditions: {
                      ...alert.conditions,
                      price: {
                        ...alert.conditions.price,
                        value: parseFloat(e.target.value)
                      }
                    }
                  })}
                />
                <select
                  className="rounded-md border-gray-300 shadow-sm"
                  disabled={!alert.conditions.price.enabled}
                  value={alert.conditions.price.condition}
                  onChange={(e) => setAlert({
                    ...alert,
                    conditions: {
                      ...alert.conditions,
                      price: {
                        ...alert.conditions.price,
                        condition: e.target.value
                      }
                    }
                  })}
                >
                  <option value="ABOVE">Above</option>
                  <option value="BELOW">Below</option>
                  <option value="CROSSES_ABOVE">Crosses Above</option>
                  <option value="CROSSES_BELOW">Crosses Below</option>
                </select>
              </div>
            </div>

            {/* Similar sections for other conditions */}
          </div>

          {/* Notifications */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={alert.notifications.email}
                  onChange={(e) => setAlert({
                    ...alert,
                    notifications: {
                      ...alert.notifications,
                      email: e.target.checked
                    }
                  })}
                />
                <span>Email</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={alert.notifications.telegram}
                  onChange={(e) => setAlert({
                    ...alert,
                    notifications: {
                      ...alert.notifications,
                      telegram: e.target.checked
                    }
                  })}
                />
                <span>Telegram</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Create Alert
          </button>
        </div>
      </form>
    </div>
  );
};
