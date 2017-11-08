/* eslint-disable no-undef */

import * as React from 'react';
import { match } from 'react-router-dom';
import * as _ from 'lodash';

import { safeLoad } from 'js-yaml';
import { TEMPLATES } from '../yaml-templates';
import { kindFromPlural } from '../kinds';
import { AsyncComponent } from './utils/async';
import { Firehose } from './utils';

export class CreateYAML extends React.PureComponent<CreateYAMLProps> {
  render () {
    const {params} = this.props.match;

    const kind = kindFromPlural(params.plural);
    if (!kind) {
      // <base href=...> makes this OK
      (window as any).location = '404';
    }

    const apiVersion = kind.apiVersion || 'v1';
    const namespace = params.ns || 'default';
    const kindStr = `${apiVersion}.${kind.kind}`;
    let template = _.get(TEMPLATES, [kindStr, 'default']);
    if (!template) {
      // eslint-disable-next-line no-console
      console.warn(`No template found for ${kindStr}. Falling back to default template.`);
      template = TEMPLATES.DEFAULT.default;
    }

    const obj = safeLoad(template);
    obj.kind = kind.kind;
    obj.metadata = obj.metadata || {};
    if (kind.namespaced) {
      obj.metadata.namespace = namespace;
    }

    const redirectURL = params.appName ? `/ns/${params.ns}/clusterserviceversion-v1s/${params.appName}/instances` : null;

    return <AsyncComponent loader={() => import('./edit-yaml').then(c => c.EditYAML)} obj={obj} create={true} kind={kind.kind} redirectURL={redirectURL} showHeader={true} />;
  }
}

export const EditYAMLPage: React.StatelessComponent<EditYAMLPageProps> = (props) => {
  const Wrapper = (props) => <AsyncComponent {...props} obj={props.obj.data} loader={() => import('./edit-yaml').then(c => c.EditYAML)} create={false} showHeader={true} />;
  return <Firehose resources={[{kind: props.kind, name: props.match.params.name, namespace: props.match.params.ns, isList: false, prop: 'obj'}]}>
    <Wrapper />
  </Firehose>;
};

export type CreateYAMLProps = {
  match: match<{ns: string, plural: string, appName?: string}>;
};

export type EditYAMLPageProps = {
  match: match<{ns: string, name: string}>;
  kind: string;
};

EditYAMLPage.displayName = 'EditYAMLPage';
