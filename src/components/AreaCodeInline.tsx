import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../theme/designSystem';

type Area = { code: string; country: string; [k: string]: any };

type Props = {
  /** Committed value (digits only). E.g. "86" or "" */
  value: string;
  /** Commit ONLY when user taps a suggestion, or when the user deletes everything (clears to ""). */
  onSelect: (code: string) => void;
  /** Max dropdown height */
  maxDropdownHeight?: number;
  /** Optional style overrides */
  textStyle?: any;
  separatorStyle?: any;
};

const onlyDigits = (s: string) => (s || '').replace(/[^\d]/g, '');

const SUGGESTIONS: Area[] = [
  { code: '1', country: 'United States' },
  { code: '44', country: 'United Kingdom' },
  { code: '86', country: 'China' },
  { code: '81', country: 'Japan' },
  { code: '49', country: 'Germany' },
  { code: '33', country: 'France' },
  { code: '39', country: 'Italy' },
  { code: '34', country: 'Spain' },
  { code: '31', country: 'Netherlands' },
  { code: '32', country: 'Belgium' },
  { code: '41', country: 'Switzerland' },
  { code: '43', country: 'Austria' },
  { code: '46', country: 'Sweden' },
  { code: '47', country: 'Norway' },
  { code: '45', country: 'Denmark' },
  { code: '358', country: 'Finland' },
  { code: '48', country: 'Poland' },
  { code: '420', country: 'Czech Republic' },
  { code: '36', country: 'Hungary' },
  { code: '40', country: 'Romania' },
  { code: '380', country: 'Ukraine' },
  { code: '7', country: 'Russia' },
  { code: '90', country: 'Turkey' },
  { code: '971', country: 'UAE' },
  { code: '966', country: 'Saudi Arabia' },
  { code: '972', country: 'Israel' },
  { code: '91', country: 'India' },
  { code: '880', country: 'Bangladesh' },
  { code: '92', country: 'Pakistan' },
  { code: '93', country: 'Afghanistan' },
  { code: '98', country: 'Iran' },
  { code: '964', country: 'Iraq' },
  { code: '965', country: 'Kuwait' },
  { code: '973', country: 'Bahrain' },
  { code: '974', country: 'Qatar' },
  { code: '968', country: 'Oman' },
  { code: '967', country: 'Yemen' },
  { code: '962', country: 'Jordan' },
  { code: '961', country: 'Lebanon' },
  { code: '963', country: 'Syria' },
  { code: '20', country: 'Egypt' },
  { code: '212', country: 'Morocco' },
  { code: '216', country: 'Tunisia' },
  { code: '213', country: 'Algeria' },
  { code: '218', country: 'Libya' },
  { code: '251', country: 'Ethiopia' },
  { code: '254', country: 'Kenya' },
  { code: '255', country: 'Tanzania' },
  { code: '256', country: 'Uganda' },
  { code: '257', country: 'Burundi' },
  { code: '250', country: 'Rwanda' },
  { code: '260', country: 'Zambia' },
  { code: '263', country: 'Zimbabwe' },
  { code: '27', country: 'South Africa' },
  { code: '234', country: 'Nigeria' },
  { code: '233', country: 'Ghana' },
  { code: '225', country: 'Ivory Coast' },
  { code: '237', country: 'Cameroon' },
  { code: '236', country: 'Central African Republic' },
  { code: '235', country: 'Chad' },
  { code: '238', country: 'Cape Verde' },
  { code: '239', country: 'São Tomé and Príncipe' },
  { code: '240', country: 'Equatorial Guinea' },
  { code: '241', country: 'Gabon' },
  { code: '242', country: 'Republic of the Congo' },
  { code: '243', country: 'Democratic Republic of the Congo' },
  { code: '244', country: 'Angola' },
  { code: '245', country: 'Guinea-Bissau' },
  { code: '246', country: 'British Indian Ocean Territory' },
  { code: '247', country: 'Ascension Island' },
  { code: '248', country: 'Seychelles' },
  { code: '258', country: 'Mozambique' },
  { code: '261', country: 'Madagascar' },
  { code: '262', country: 'Réunion' },
  { code: '264', country: 'Namibia' },
  { code: '265', country: 'Malawi' },
  { code: '266', country: 'Lesotho' },
  { code: '267', country: 'Botswana' },
  { code: '268', country: 'Eswatini' },
  { code: '269', country: 'Comoros' },
  { code: '290', country: 'Saint Helena' },
  { code: '291', country: 'Eritrea' },
  { code: '297', country: 'Aruba' },
  { code: '298', country: 'Faroe Islands' },
  { code: '299', country: 'Greenland' },
  { code: '350', country: 'Gibraltar' },
  { code: '351', country: 'Portugal' },
  { code: '352', country: 'Luxembourg' },
  { code: '353', country: 'Ireland' },
  { code: '354', country: 'Iceland' },
  { code: '355', country: 'Albania' },
  { code: '356', country: 'Malta' },
  { code: '357', country: 'Cyprus' },
  { code: '359', country: 'Bulgaria' },
  { code: '370', country: 'Lithuania' },
  { code: '371', country: 'Latvia' },
  { code: '372', country: 'Estonia' },
  { code: '373', country: 'Moldova' },
  { code: '374', country: 'Armenia' },
  { code: '375', country: 'Belarus' },
  { code: '376', country: 'Andorra' },
  { code: '377', country: 'Monaco' },
  { code: '378', country: 'San Marino' },
  { code: '379', country: 'Vatican City' },
  { code: '381', country: 'Serbia' },
  { code: '382', country: 'Montenegro' },
  { code: '383', country: 'Kosovo' },
  { code: '385', country: 'Croatia' },
  { code: '386', country: 'Bosnia and Herzegovina' },
  { code: '387', country: 'North Macedonia' },
  { code: '389', country: 'North Macedonia' },
  { code: '421', country: 'Slovakia' },
  { code: '423', country: 'Liechtenstein' },
  { code: '500', country: 'Falkland Islands' },
  { code: '501', country: 'Belize' },
  { code: '502', country: 'Guatemala' },
  { code: '503', country: 'El Salvador' },
  { code: '504', country: 'Honduras' },
  { code: '505', country: 'Nicaragua' },
  { code: '506', country: 'Costa Rica' },
  { code: '507', country: 'Panama' },
  { code: '508', country: 'Saint Pierre and Miquelon' },
  { code: '509', country: 'Haiti' },
  { code: '590', country: 'Guadeloupe' },
  { code: '591', country: 'Bolivia' },
  { code: '592', country: 'Guyana' },
  { code: '593', country: 'Ecuador' },
  { code: '594', country: 'French Guiana' },
  { code: '595', country: 'Paraguay' },
  { code: '596', country: 'Martinique' },
  { code: '597', country: 'Suriname' },
  { code: '598', country: 'Uruguay' },
  { code: '599', country: 'Curaçao' },
  { code: '670', country: 'East Timor' },
  { code: '671', country: 'Guam' },
  { code: '672', country: 'Australian External Territories' },
  { code: '673', country: 'Brunei' },
  { code: '674', country: 'Nauru' },
  { code: '675', country: 'Papua New Guinea' },
  { code: '676', country: 'Tonga' },
  { code: '677', country: 'Solomon Islands' },
  { code: '678', country: 'Vanuatu' },
  { code: '679', country: 'Fiji' },
  { code: '680', country: 'Palau' },
  { code: '681', country: 'Wallis and Futuna' },
  { code: '682', country: 'Cook Islands' },
  { code: '683', country: 'Niue' },
  { code: '685', country: 'Samoa' },
  { code: '686', country: 'Kiribati' },
  { code: '687', country: 'New Caledonia' },
  { code: '688', country: 'Tuvalu' },
  { code: '689', country: 'French Polynesia' },
  { code: '690', country: 'Tokelau' },
  { code: '691', country: 'Micronesia' },
  { code: '692', country: 'Marshall Islands' },
  { code: '850', country: 'North Korea' },
  { code: '852', country: 'Hong Kong' },
  { code: '853', country: 'Macau' },
  { code: '855', country: 'Cambodia' },
  { code: '856', country: 'Laos' },
  { code: '886', country: 'Taiwan' },
  { code: '960', country: 'Maldives' },
  { code: '970', country: 'Palestine' },
  { code: '975', country: 'Bhutan' },
  { code: '976', country: 'Mongolia' },
  { code: '977', country: 'Nepal' },
  { code: '992', country: 'Tajikistan' },
  { code: '993', country: 'Turkmenistan' },
  { code: '994', country: 'Azerbaijan' },
  { code: '995', country: 'Georgia' },
  { code: '996', country: 'Kyrgyzstan' },
  { code: '998', country: 'Uzbekistan' },
];

const AreaCodeInline: React.FC<Props> = ({
  value,
  onSelect,
  maxDropdownHeight = 220,
  textStyle,
  separatorStyle,
}) => {
  /** DRAFT = what the user is typing right now (digits). Never committed until pick */
  const [draft, setDraft] = useState<string>('');
  /** List visibility: only true when there is draft + matches */
  const [open, setOpen] = useState<boolean>(false);
  /** Keep last committed value around for quick revert on dismiss */
  const committedRef = useRef<string>(value);

  /** Keep committedRef in sync if parent updates programmatically */
  useEffect(() => {
    committedRef.current = value;
    // If parent cleared value, also clear any draft display
    if (!value) setDraft('');
  }, [value]);

  /** Filter suggestions by current draft */
  const filtered: Area[] = useMemo(() => {
    const d = onlyDigits(draft);
    if (!d) return [];
    return SUGGESTIONS.filter((a) => onlyDigits(a.code).startsWith(d));
  }, [draft]);

  /** What the user sees in the inline area segment */
  const displayArea = draft.length > 0
    ? `+${draft}`
    : (value ? `+${onlyDigits(value)}` : '');

  /** User types digits in area slot */
  const handleType = (txt: string) => {
    const digits = onlyDigits(txt);

    if (digits.length === 0) {
      // RULE 4: user deleted everything -> clear both draft AND committed value
      setDraft('');
      setOpen(false);
      onSelect('');           // commit clear
      return;
    }

    // User is typing. DO NOT commit.
    setDraft(digits);
    setOpen(true);            // show list (may be empty)
  };

  /** Dismiss: ALWAYS revert to committed, never save the draft */
  const dismissWithoutCommit = () => {
    setDraft('');             // revert visual to committed
    setOpen(false);
    Keyboard.dismiss();
  };

  /** Commit only when a suggestion is tapped */
  const commitPick = (a: Area) => {
    setDraft('');
    setOpen(false);
    onSelect(onlyDigits(a.code));   // commit numeric code (no "+")
    Keyboard.dismiss();
  };

  return (
    <View style={styles.wrap}>
      {/* Inline, borderless area code input */}
      <TextInput
        value={displayArea}
        onChangeText={handleType}
        placeholder="+code"
        placeholderTextColor={Colors.textSecondary}
        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
        onFocus={() => {
          // RULE: focusing should NOT auto-open; typing will
        }}
        style={[styles.inlineArea, textStyle]}
      />

      {/* Separator | */}
      <Text style={[styles.sep, separatorStyle]}>|</Text>

      {/* Absolute overlay + non-virtualized dropdown */}
      {open && (
        <>
          {/* Tap-catcher to dismiss WITHOUT committing draft */}
          <Pressable style={styles.overlay} onPress={dismissWithoutCommit} />

          {/* Show list only if there are matches; if none, we still allow dismiss to revert */}
          {filtered.length > 0 && (
            <View style={[styles.dropdown, { maxHeight: maxDropdownHeight }]}>
              <ScrollView keyboardShouldPersistTaps="handled">
                {filtered.map((item, idx) => (
                  <Pressable
                    key={`${item.code}-${idx}`}
                    onPress={() => commitPick(item)}
                    style={({ pressed }) => [
                      styles.option,
                      pressed && { backgroundColor: Colors.calendarGrid },
                    ]}
                  >
                    <Text style={styles.optionText}>
                      {item.country} (+{item.code})
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,      // ensure dropdown stacks above row
    elevation: 10,
  },
  inlineArea: {
    // borderless, feels like part of the phone textbox
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginRight: Spacing.xs,
    color: Colors.black,
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    minWidth: 60,
  },
  sep: {
    marginRight: Spacing.sm,
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    left: -1000,
    right: -1000,
    top: -1000,
    bottom: -1000,
    zIndex: 9,
  },
  dropdown: {
    position: 'absolute',
    top: 46,              // just below typical 45px input row
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.calendarGrid,
    ...Shadows,
    zIndex: 11,
    elevation: 11,
    minWidth: 280,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.black,
  },
});

export default AreaCodeInline;
