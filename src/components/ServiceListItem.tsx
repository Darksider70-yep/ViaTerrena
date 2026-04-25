import React from 'react';
import { Animated } from 'react-native';
import { ServiceCard } from './ServiceCard';
import { NearbyPlace } from '../services/placesService';

interface ServiceListItemProps {
  place: NearbyPlace;
  onCallPress: (phone: string) => void;
  onDirectionsPress: (place: NearbyPlace) => void;
  onPress: (place: NearbyPlace) => void;
  highlightedId: string | null;
  flashAnim: Animated.Value;
}

export const ServiceListItem = ({
  place,
  onCallPress,
  onDirectionsPress,
  onPress,
  highlightedId,
  flashAnim,
}: ServiceListItemProps) => {
  return (
    <Animated.View style={{
      backgroundColor: highlightedId === place.placeId 
        ? flashAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['#FFFFFF', '#FFF9C4']
          })
        : '#FFFFFF',
      borderRadius: 12
    }}>
      <ServiceCard
        place={place}
        onCallPress={onCallPress}
        onDirectionsPress={onDirectionsPress}
        onPress={onPress}
      />
    </Animated.View>
  );
};
