import React from 'react';
import { FormattedMessage } from 'react-intl'

const translate = (id, def, value = {}) =>
    <FormattedMessage id={id} defaultMessage={def} values={{ ...value }} />

export default translate