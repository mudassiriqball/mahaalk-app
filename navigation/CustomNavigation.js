import * as React from 'react';

const navigationRef = React.createRef();

export default function CustomNavigation(name, params) {
    navigationRef.current && navigationRef.current.navigate(name, params);
}