/* eslint-disable no-undef */

import { connect } from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import * as _ from 'lodash-es';

export const enum AlertStates {
  Firing = 'firing',
  Silenced = 'silenced',
  Pending = 'pending',
  NotFiring = 'not-firing',
}

export const enum SilenceStates {
  Active = 'active',
  Pending = 'pending',
  Expired = 'expired',
}

export enum MonitoringRoutes {
  Prometheus = 'prometheus-k8s',
  AlertManager = 'alertmanager-main',
  Grafana = 'grafana',
  Kibana = 'kibana',
}

const SET_MONITORING_URL = 'setMonitoringURL';
const DEFAULTS = _.mapValues(MonitoringRoutes, undefined);

export const setMonitoringURL = (name, url) => ({name, url, type: SET_MONITORING_URL});

export const monitoringReducer = (state: ImmutableMap<string, any>, action) => {
  if (!state) {
    return ImmutableMap(DEFAULTS);
  }

  switch (action.type) {
    case SET_MONITORING_URL:
      return state.merge({ [action.name]: action.url });

    default:
      return state;
  }
};

export const monitoringReducerName = 'monitoringURLs';
const stateToProps = (desiredURLs: string[], state) => {
  const urls = desiredURLs.reduce((previous, next) => ({...previous, [next]: state[monitoringReducerName].get(next)}), {});
  return { urls };
};

export const connectToURLs = (...urls) => connect(state => stateToProps(urls, state));

export const alertState = a => _.get(a, 'state', AlertStates.NotFiring);
export const silenceState = s => _.get(s, 'status.state');

// Sort alerts and silences by their state (sort first by the state itself, then by the timestamp relevant to the state)
export const alertStateOrder = alert => [
  [AlertStates.Firing, AlertStates.Silenced, AlertStates.Pending, AlertStates.NotFiring].indexOf(alertState(alert)),
  alertState(alert) === AlertStates.Silenced ? _.max(_.map(alert.silencedBy, 'endsAt')) : _.get(alert, 'activeAt'),
];
export const silenceStateOrder = silence => [
  [SilenceStates.Active, SilenceStates.Pending, SilenceStates.Expired].indexOf(silenceState(silence)),
  _.get(silence, silenceState(silence) === SilenceStates.Pending ? 'startsAt' : 'endsAt'),
];

// Determine if an Alert is silenced by a Silence (if all of the Silence's matchers match one of the Alert's labels)
export const isSilenced = (alert, silence) => [AlertStates.Firing, AlertStates.Silenced].includes(alert.state) &&
  _.every(silence.matchers, m => {
    const alertValue = _.get(alert.labels, m.name);
    return alertValue !== undefined &&
      (m.isRegex ? (new RegExp(`^${m.value}$`)).test(alertValue) : alertValue === m.value);
  });
