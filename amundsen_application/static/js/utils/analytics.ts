import Analytics, { AnalyticsInstance } from 'analytics';

import * as ConfigUtils from 'config/config-utils';

let _analyticsInstance;

export const analyticsInstance = (): AnalyticsInstance => {
  if (_analyticsInstance) {
    return _analyticsInstance;
  }

  console.log("analytics config", ConfigUtils.getAnalyticsConfig())

  const plugins = ConfigUtils.getAnalyticsConfig().plugins;

  _analyticsInstance = Analytics({
    app: 'amundsen',
    version: '100',
    plugins: plugins
  });

  return _analyticsInstance;
};

export const trackEvent = (eventName: string, payload: Map<string, any>) => {
  const analytics = analyticsInstance();
  analytics.track(eventName, payload);
  console.log(`Tracking [${eventName}]:`, payload);
};
