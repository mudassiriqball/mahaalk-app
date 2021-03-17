import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/AccountScreen';
import CartScreen from '../screens/CartScreen';
import CategoriesScreen from '../screens/CategoriesScreen';

import { AntDesign, Feather } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';


export default function BottomTabNavigator(props) {
  props.navigation.setOptions({ headerTitle: getHeaderTitle(props.route) });
  return (
    <BottomTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{
        activeTintColor: Colors.primary_color,
        tabStyle: { marginVertical: 5 },
        labelStyle: { fontSize: 12 }
      }}
    >
      {/* Home */}
      <BottomTab.Screen name="Home"
        options={{
          title: props.locale == 'en' ? 'Home' : 'الصفحة الرئيسية',
          tabBarIcon: ({ focused }) => <AntDesign style={{}} name="home" size={21} color={focused ? Colors.primary_color : Colors.tabIconDefault} />,
        }}
      >
        {prop => <HomeScreen {...props} />}
      </BottomTab.Screen>

      {/* Categories */}
      <BottomTab.Screen name="Categories"
        options={{
          title: props.locale == 'en' ? 'Categories' : 'فئات',
          tabBarIcon: ({ focused }) => <Foundation name="thumbnails" size={26} color={focused ? Colors.primary_color : Colors.tabIconDefault} />,
        }}
      >
        {prop => <CategoriesScreen {...props} />}
      </BottomTab.Screen>

      {/* Cart */}
      <BottomTab.Screen name="Cart"
        options={{
          title: props.locale == 'en' ? 'Cart' : 'السلة',
          tabBarIcon: ({ focused }) => <EvilIcons name="cart" size={28} color={focused ? Colors.primary_color : Colors.tabIconDefault} />,
          tabBarBadge: props.cart_count > 0 ? props.cart_count : null
        }}
      >
        {prop => <CartScreen {...props} />}
      </BottomTab.Screen>

      {/* Account */}
      <BottomTab.Screen name="Account"
        options={{
          title: props.locale == 'en' ? 'Account' : 'الحساب',
          tabBarIcon: ({ focused }) => <SimpleLineIcons name="user" size={18} color={focused ? Colors.primary_color : Colors.tabIconDefault} />,
        }}
      >
        {prop => <AccountScreen {...props} />}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'How to get started';
    case 'Links':
      return 'Links to learn more';
  }
}
