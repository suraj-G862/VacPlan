import React, { useRef } from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { ShareableWeekendCard } from './ShareableWeekendCard';
import { WeekendPlan } from '../utils/types';

interface ShareWeekendButtonProps {
  plan: WeekendPlan;
}

export function ShareWeekendButton({ plan }: ShareWeekendButtonProps) {
  const viewRef = useRef<View>(null);

  const handleShare = async () => {
    try {
      if (!viewRef.current) return;

      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });
      
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Your Weekend Plan',
      });
    } catch (error) {
      console.error('Error sharing weekend plan:', error);
    }
  };

  return (
    <View>
      <View 
        ref={viewRef} 
        style={{ position: 'absolute', opacity: 0, zIndex: -1 }}
      >
        <ShareableWeekendCard plan={plan} />
      </View>
      <IconButton
        icon="share-variant"
        size={24}
        onPress={handleShare}
      />
    </View>
  );
}
