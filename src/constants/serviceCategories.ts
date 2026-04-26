import { colors } from './colors';

export const SERVICE_CATEGORIES = [
  { id: 'hospital',      label: 'Hospitals',       color: colors.hospital,   emoji: '🏥' },
  { id: 'ambulance',     label: 'Ambulance',        color: colors.ambulance,  emoji: '🚑' },
  { id: 'police',        label: 'Police',           color: colors.police,     emoji: '🚔' },
  { id: 'towing',        label: 'Towing',           color: colors.towing,     emoji: '🚗' },
  { id: 'puncture_shop', label: 'Tyre Repair',      color: colors.puncture,   emoji: '🔧' },
  { id: 'showroom',      label: 'Showrooms',        color: colors.showroom,   emoji: '🏪' },
];

export const EMERGENCY_EMOJI_MAP: Record<string, string> = {
  police: '🚔', fire: '🔥', ambulance: '🚑',
  emergency: '📞', highway: '🛣️', womenHelpline: '👩',
};

export const EMERGENCY_COLOR_MAP: Record<string, string> = {
  police: colors.police, fire: '#E25C1A',
  ambulance: colors.primary, emergency: colors.primary,
  highway: colors.towing,
};
