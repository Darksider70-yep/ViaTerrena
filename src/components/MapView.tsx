import React, { forwardRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, MapViewProps } from 'react-native-maps';
import { NearbyPlace } from '../services/placesService';
import { SERVICE_CATEGORIES } from '../constants/serviceCategories';

interface CustomMapViewProps extends MapViewProps {
  places: NearbyPlace[];
  onMarkerCalloutPress: (place: NearbyPlace) => void;
  getMarkerColor: (category: string) => string;
}

export const CustomMapView = forwardRef<MapView, CustomMapViewProps>(({
  places,
  onMarkerCalloutPress,
  getMarkerColor,
  ...props
}, ref) => {
  return (
    <MapView
      ref={ref}
      style={styles.map}
      showsUserLocation={true}
      showsMyLocationButton={true}
      {...props}
    >
      {places.map((place) => {
        const catInfo = SERVICE_CATEGORIES.find(c => c.id === place.category);
        const color = getMarkerColor(place.category);
        
        return (
          <Marker
            key={place.placeId}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            onCalloutPress={() => onMarkerCalloutPress(place)}
            tracksViewChanges={false}
          >
            <View style={[styles.markerContainer, { backgroundColor: color }]}>
              <Text style={styles.markerEmoji}>{catInfo?.emoji || '📍'}</Text>
              <View style={styles.markerArrow} />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  markerEmoji: {
    fontSize: 14,
  },
  markerArrow: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
    alignSelf: 'center',
  },
});
