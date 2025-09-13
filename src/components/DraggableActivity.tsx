import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import { Activity } from '../utils/types';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {
  activity: Activity;
  onRemove: () => void;
  onMove: (position?: number) => void;
  index: number;
  totalItems: number;
}

interface Props {
  activity: Activity;
  onRemove: () => void;
  onMove: (position?: number) => void;
  index: number;
  totalItems: number;
}

const DraggableActivity = ({ activity, onRemove, onMove, index, totalItems }: Props) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardHeight = useSharedValue(80); // Approximate height of the card

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationY) > cardHeight.value) {
        // Calculate the new position based on vertical movement
        const direction = event.translationY > 0 ? 1 : -1;
        const movement = Math.round(Math.abs(event.translationY) / cardHeight.value);
        const newPosition = Math.max(0, Math.min(index + (direction * movement), totalItems - 1));
        
        if (newPosition !== index) {
          runOnJS(onMove)(newPosition);
        }
      }
      
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.icon}>{activity.icon}</Text>
              <Text variant="titleMedium">{activity.title}</Text>
            </View>
            <View style={styles.details}>
              <Text variant="bodySmall">{activity.duration} min</Text>
              <Text variant="bodySmall">{activity.category}</Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <IconButton icon="arrow-up-down" onPress={() => onMove()} />
            <IconButton icon="delete" onPress={onRemove} />
          </Card.Actions>
        </Card>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  card: {
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  details: {
    alignItems: 'flex-end',
  },
});

export default DraggableActivity;
