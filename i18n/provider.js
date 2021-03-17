import React, { Fragment } from 'react';
import { IntlProvider } from 'react-intl'

import messages from './messages'
import { LOCALES } from './locales';
const Provider = ({ children, locale }) => {
    return <IntlProvider
        locale={locale}
        textComponent={Fragment}
        messages={messages[locale]}
        defaultLocale={LOCALES.ENGLISH}
    >
        {children}
    </IntlProvider>
}

export default Provider;