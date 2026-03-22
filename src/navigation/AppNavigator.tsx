import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import StockGameScreen from '../screens/StockGameScreen';
import NewsScreen from '../screens/NewsScreen';
import QuizScreen from '../screens/QuizScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import { colors, fontSize } from '../components/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiFocused]}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

function MainTabs({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="홈" focused={focused} />,
        }}
      >
        {(props) => <HomeScreen {...props} navigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen
        name="StockGame"
        component={StockGameScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📈" label="차트게임" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📰" label="뉴스" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎯" label="퀴즈" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🤖" label="챗봇" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 70,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  tabEmoji: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabEmojiFocused: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: colors.primary,
    fontWeight: '700',
  },
});
