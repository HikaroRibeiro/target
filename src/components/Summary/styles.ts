import { colors, fontFamily } from '@/theme';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 5
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  value: {
    fontSize: 10,
    color: colors.white,
    fontFamily: fontFamily.regular
  },
  label: {
    fontSize: 12,
    color: colors.white,
    fontFamily: fontFamily.regular
  }
});