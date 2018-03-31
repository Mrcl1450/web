import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { translate } from 'react-i18next';
import Switch from 'material-ui-next/Switch'; // eslint-disable-line
import LabeledControl from './LabeledControl';

const enhance = compose(
  withProps(props => ({
    onToggleUserJoin(e, value) {
      props.onSettingChange('notifications.userJoin', value);
    },
    onToggleUserLeave(e, value) {
      props.onSettingChange('notifications.userLeave', value);
    },
    onToggleUserNameChanged(e, value) {
      props.onSettingChange('notifications.userNameChanged', value);
    },
    onToggleSkip(e, value) {
      props.onSettingChange('notifications.skip', value);
    },
  })),
  translate(),
);

const NotificationSettings = ({
  t,
  settings,
  onToggleUserJoin,
  onToggleUserLeave,
  onToggleUserNameChanged,
  onToggleSkip,
}) => (
  <div>
    <h2 className="SettingsPanel-header">{t('settings.notifications.title')}</h2>
    <p className="SettingsPanel-helpText">{t('settings.notifications.help')}</p>
    <LabeledControl label={t('settings.notifications.userJoin')}>
      <Switch
        checked={settings.notifications.userJoin}
        onChange={onToggleUserJoin}
      />
    </LabeledControl>
    <LabeledControl label={t('settings.notifications.userLeave')}>
      <Switch
        checked={settings.notifications.userLeave}
        onChange={onToggleUserLeave}
      />
    </LabeledControl>
    <LabeledControl label={t('settings.notifications.userNameChanged')}>
      <Switch
        checked={settings.notifications.userNameChanged}
        onChange={onToggleUserNameChanged}
      />
    </LabeledControl>
    <LabeledControl label={t('settings.notifications.skip')}>
      <Switch
        checked={settings.notifications.skip}
        onChange={onToggleSkip}
      />
    </LabeledControl>
  </div>
);

NotificationSettings.propTypes = {
  t: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  onSettingChange: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  onToggleUserJoin: PropTypes.func.isRequired,
  onToggleUserLeave: PropTypes.func.isRequired,
  onToggleUserNameChanged: PropTypes.func.isRequired,
  onToggleSkip: PropTypes.func.isRequired,
};

export default enhance(NotificationSettings);
