
import { t } from '@lingui/macro'

export function countries(){
  const data = {
  EU: [
    { name: t`Andorra`, code: 'AD', flag: '🇦🇩', cont: 'EU' },
    { name: t`Albania`, code: 'AL', flag: '🇦🇱', cont: 'EU' },
    { name: t`Austria`, code: 'AT', flag: '🇦🇹', cont: 'EU' },
    { name: t`Åland`, code: 'AX', flag: '🇦🇽', cont: 'EU' },
    {
      name: t`Bosnia and Herzegovina`,
      code: 'BA',
      flag: '🇧🇦',
      cont: 'EU'
    },
    { name: t`Belgium`, code: 'BE', flag: '🇧🇪', cont: 'EU' },
    { name: t`Bulgaria`, code: 'BG', flag: '🇧🇬', cont: 'EU' },
    { name: t`Belarus`, code: 'BY', flag: '🇧🇾', cont: 'EU' },
    { name: t`Switzerland`, code: 'CH', flag: '🇨🇭', cont: 'EU' },
    { name: t`Cyprus`, code: 'CY', flag: '🇨🇾', cont: 'EU' },
    { name: t`Czech Republic`, code: 'CZ', flag: '🇨🇿', cont: 'EU' },
    { name: t`Germany`, code: 'DE', flag: '🇩🇪', cont: 'EU' },
    { name: t`Denmark`, code: 'DK', flag: '🇩🇰', cont: 'EU' },
    { name: t`Estonia`, code: 'EE', flag: '🇪🇪', cont: 'EU' },
    { name: t`Spain`, code: 'ES', flag: '🇪🇸', cont: 'EU' },
    { name: t`Finland`, code: 'FI', flag: '🇫🇮', cont: 'EU' },
    { name: t`Faroe Islands`, code: 'FO', flag: '🇫🇴', cont: 'EU' },
    { name: t`France`, code: 'FR', flag: '🇫🇷', cont: 'EU' },
    { name: t`United Kingdom`, code: 'GB', flag: '🇬🇧', cont: 'EU' },
    { name: t`Guernsey`, code: 'GG', flag: '🇬🇬', cont: 'EU' },
    { name: t`Gibraltar`, code: 'GI', flag: '🇬🇮', cont: 'EU' },
    { name: t`Greece`, code: 'GR', flag: '🇬🇷', cont: 'EU' },
    { name: t`Croatia`, code: 'HR', flag: '🇭🇷', cont: 'EU' },
    { name: t`Hungary`, code: 'HU', flag: '🇭🇺', cont: 'EU' },
    { name: t`Ireland`, code: 'IE', flag: '🇮🇪', cont: 'EU' },
    { name: t`Isle of Man`, code: 'IM', flag: '🇮🇲', cont: 'EU' },
    { name: t`Iceland`, code: 'IS', flag: '🇮🇸', cont: 'EU' },
    { name: t`Italy`, code: 'IT', flag: '🇮🇹', cont: 'EU' },
    { name: t`Jersey`, code: 'JE', flag: '🇯🇪', cont: 'EU' },
    { name: t`Liechtenstein`, code: 'LI', flag: '🇱🇮', cont: 'EU' },
    { name: t`Lithuania`, code: 'LT', flag: '🇱🇹', cont: 'EU' },
    { name: t`Luxembourg`, code: 'LU', flag: '🇱🇺', cont: 'EU' },
    { name: t`Latvia`, code: 'LV', flag: '🇱🇻', cont: 'EU' },
    { name: t`Monaco`, code: 'MC', flag: '🇲🇨', cont: 'EU' },
    { name: t`Moldova`, code: 'MD', flag: '🇲🇩', cont: 'EU' },
    { name: t`Montenegro`, code: 'ME', flag: '🇲🇪', cont: 'EU' },
    {
      name: t`North Macedonia`,
      code: 'MK',
      flag: '🇲🇰',
      cont: 'EU'
    },
    { name: t`Malta`, code: 'MT', flag: '🇲🇹', cont: 'EU' },
    { name: t`Netherlands`, code: 'NL', flag: '🇳🇱', cont: 'EU' },
    { name: t`Norway`, code: 'NO', flag: '🇳🇴', cont: 'EU' },
    { name: t`Poland`, code: 'PL', flag: '🇵🇱', cont: 'EU' },
    { name: t`Portugal`, code: 'PT', flag: '🇵🇹', cont: 'EU' },
    { name: t`Romania`, code: 'RO', flag: '🇷🇴', cont: 'EU' },
    { name: t`Serbia`, code: 'RS', flag: '🇷🇸', cont: 'EU' },
    { name: t`Russia`, code: 'RU', flag: '🇷🇺', cont: 'EU' },
    { name: t`Sweden`, code: 'SE', flag: '🇸🇪', cont: 'EU' },
    { name: t`Slovenia`, code: 'SI', flag: '🇸🇮', cont: 'EU' },
    {
      name: t`Svalbard and Jan Mayen`,
      code: 'SJ',
      flag: '🇸🇯',
      cont: 'EU'
    },
    { name: t`Slovakia`, code: 'SK', flag: '🇸🇰', cont: 'EU' },
    { name: t`San Marino`, code: 'SM', flag: '🇸🇲', cont: 'EU' },
    { name: t`Ukraine`, code: 'UA', flag: '🇺🇦', cont: 'EU' },
    { name: t`Vatican City`, code: 'VA', flag: '🇻🇦', cont: 'EU' }
  ],
  AS: [
    {
      name: t`United Arab Emirates`,
      code: 'AE',
      flag: '🇦🇪',
      cont: 'AS'
    },
    { name: t`Afghanistan`, code: 'AF', flag: '🇦🇫', cont: 'AS' },
    { name: t`Armenia`, code: 'AM', flag: '🇦🇲', cont: 'AS' },
    { name: t`Azerbaijan`, code: 'AZ', flag: '🇦🇿', cont: 'AS' },
    { name: t`Bangladesh`, code: 'BD', flag: '🇧🇩', cont: 'AS' },
    { name: t`Bahrain`, code: 'BH', flag: '🇧🇭', cont: 'AS' },
    { name: t`Brunei`, code: 'BN', flag: '🇧🇳', cont: 'AS' },
    { name: t`Bhutan`, code: 'BT', flag: '🇧🇹', cont: 'AS' },
    {
      name: t`Cocos [Keeling] Islands`,
      code: 'CC',
      flag: '🇨🇨',
      cont: 'AS'
    },
    { name: t`China`, code: 'CN', flag: '🇨🇳', cont: 'AS' },
    {
      name: t`Christmas Island`,
      code: 'CX',
      flag: '🇨🇽',
      cont: 'AS'
    },
    { name: t`Georgia`, code: 'GE', flag: '🇬🇪', cont: 'AS' },
    { name: t`Hong Kong`, code: 'HK', flag: '🇭🇰', cont: 'AS' },
    { name: t`Indonesia`, code: 'ID', flag: '🇮🇩', cont: 'AS' },
    { name: t`Israel`, code: 'IL', flag: '🇮🇱', cont: 'AS' },
    { name: t`India`, code: 'IN', flag: '🇮🇳', cont: 'AS' },
    {
      name: t`British Indian Ocean Territory`,
      code: 'IO',
      flag: '🇮🇴',
      cont: 'AS'
    },
    { name: t`Iraq`, code: 'IQ', flag: '🇮🇶', cont: 'AS' },
    { name: t`Iran`, code: 'IR', flag: '🇮🇷', cont: 'AS' },
    { name: t`Jordan`, code: 'JO', flag: '🇯🇴', cont: 'AS' },
    { name: t`Japan`, code: 'JP', flag: '🇯🇵', cont: 'AS' },
    { name: t`Kyrgyzstan`, code: 'KG', flag: '🇰🇬', cont: 'AS' },
    { name: t`Cambodia`, code: 'KH', flag: '🇰🇭', cont: 'AS' },
    { name: t`North Korea`, code: 'KP', flag: '🇰🇵', cont: 'AS' },
    { name: t`South Korea`, code: 'KR', flag: '🇰🇷', cont: 'AS' },
    { name: t`Kuwait`, code: 'KW', flag: '🇰🇼', cont: 'AS' },
    { name: t`Kazakhstan`, code: 'KZ', flag: '🇰🇿', cont: 'AS' },
    { name: t`Laos`, code: 'LA', flag: '🇱🇦', cont: 'AS' },
    { name: t`Lebanon`, code: 'LB', flag: '🇱🇧', cont: 'AS' },
    { name: t`Sri Lanka`, code: 'LK', flag: '🇱🇰', cont: 'AS' },
    {
      name: t`Myanmar [Burma]`,
      code: 'MM',
      flag: '🇲🇲',
      cont: 'AS'
    },
    { name: t`Mongolia`, code: 'MN', flag: '🇲🇳', cont: 'AS' },
    { name: t`Macao`, code: 'MO', flag: '🇲🇴', cont: 'AS' },
    { name: t`Maldives`, code: 'MV', flag: '🇲🇻', cont: 'AS' },
    { name: t`Malaysia`, code: 'MY', flag: '🇲🇾', cont: 'AS' },
    { name: t`Nepal`, code: 'NP', flag: '🇳🇵', cont: 'AS' },
    { name: t`Oman`, code: 'OM', flag: '🇴🇲', cont: 'AS' },
    { name: t`Philippines`, code: 'PH', flag: '🇵🇭', cont: 'AS' },
    { name: t`Pakistan`, code: 'PK', flag: '🇵🇰', cont: 'AS' },
    { name: t`Palestine`, code: 'PS', flag: '🇵🇸', cont: 'AS' },
    { name: t`Qatar`, code: 'QA', flag: '🇶🇦', cont: 'AS' },
    { name: t`Saudi Arabia`, code: 'SA', flag: '🇸🇦', cont: 'AS' },
    { name: t`Singapore`, code: 'SG', flag: '🇸🇬', cont: 'AS' },
    { name: t`Syria`, code: 'SY', flag: '🇸🇾', cont: 'AS' },
    { name: t`Thailand`, code: 'TH', flag: '🇹🇭', cont: 'AS' },
    { name: t`Tajikistan`, code: 'TJ', flag: '🇹🇯', cont: 'AS' },
    { name: t`Turkmenistan`, code: 'TM', flag: '🇹🇲', cont: 'AS' },
    { name: t`Turkey`, code: 'TR', flag: '🇹🇷', cont: 'AS' },
    { name: t`Taiwan`, code: 'TW', flag: '🇹🇼', cont: 'AS' },
    { name: t`Uzbekistan`, code: 'UZ', flag: '🇺🇿', cont: 'AS' },
    { name: t`Vietnam`, code: 'VN', flag: '🇻🇳', cont: 'AS' },
    { name: t`Yemen`, code: 'YE', flag: '🇾🇪', cont: 'AS' }
  ],
  NA: [
    {
      name: t`Antigua and Barbuda`,
      code: 'AG',
      flag: '🇦🇬',
      cont: 'NA'
    },
    { name: t`Anguilla`, code: 'AI', flag: '🇦🇮', cont: 'NA' },
    { name: t`Aruba`, code: 'AW', flag: '🇦🇼', cont: 'NA' },
    { name: t`Barbados`, code: 'BB', flag: '🇧🇧', cont: 'NA' },
    {
      name: t`Saint Barthélemy`,
      code: 'BL',
      flag: '🇧🇱',
      cont: 'NA'
    },
    { name: t`Bermuda`, code: 'BM', flag: '🇧🇲', cont: 'NA' },
    { name: t`Bonaire`, code: 'BQ', flag: '🇧🇶', cont: 'NA' },
    { name: t`Bahamas`, code: 'BS', flag: '🇧🇸', cont: 'NA' },
    { name: t`Belize`, code: 'BZ', flag: '🇧🇿', cont: 'NA' },
    { name: t`Canada`, code: 'CA', flag: '🇨🇦', cont: 'NA' },
    { name: t`Costa Rica`, code: 'CR', flag: '🇨🇷', cont: 'NA' },
    { name: t`Cuba`, code: 'CU', flag: '🇨🇺', cont: 'NA' },
    { name: t`Curacao`, code: 'CW', flag: '🇨🇼', cont: 'NA' },
    { name: t`Dominica`, code: 'DM', flag: '🇩🇲', cont: 'NA' },
    {
      name: t`Dominican Republic`,
      code: 'DO',
      flag: '🇩🇴',
      cont: 'NA'
    },
    { name: t`Grenada`, code: 'GD', flag: '🇬🇩', cont: 'NA' },
    { name: t`Greenland`, code: 'GL', flag: '🇬🇱', cont: 'NA' },
    { name: t`Guadeloupe`, code: 'GP', flag: '🇬🇵', cont: 'NA' },
    { name: t`Guatemala`, code: 'GT', flag: '🇬🇹', cont: 'NA' },
    { name: t`Honduras`, code: 'HN', flag: '🇭🇳', cont: 'NA' },
    { name: t`Haiti`, code: 'HT', flag: '🇭🇹', cont: 'NA' },
    { name: t`Jamaica`, code: 'JM', flag: '🇯🇲', cont: 'NA' },
    {
      name: t`Saint Kitts and Nevis`,
      code: 'KN',
      flag: '🇰🇳',
      cont: 'NA'
    },
    { name: t`Cayman Islands`, code: 'KY', flag: '🇰🇾', cont: 'NA' },
    { name: t`Saint Lucia`, code: 'LC', flag: '🇱🇨', cont: 'NA' },
    { name: t`Saint Martin`, code: 'MF', flag: '🇲🇫', cont: 'NA' },
    { name: t`Martinique`, code: 'MQ', flag: '🇲🇶', cont: 'NA' },
    { name: t`Montserrat`, code: 'MS', flag: '🇲🇸', cont: 'NA' },
    { name: t`Mexico`, code: 'MX', flag: '🇲🇽', cont: 'NA' },
    { name: t`Nicaragua`, code: 'NI', flag: '🇳🇮', cont: 'NA' },
    { name: t`Panama`, code: 'PA', flag: '🇵🇦', cont: 'NA' },
    {
      name: t`Saint Pierre and Miquelon`,
      code: 'PM',
      flag: '🇵🇲',
      cont: 'NA'
    },
    { name: t`Puerto Rico`, code: 'PR', flag: '🇵🇷', cont: 'NA' },
    { name: t`El Salvador`, code: 'SV', flag: '🇸🇻', cont: 'NA' },
    { name: t`Sint Maarten`, code: 'SX', flag: '🇸🇽', cont: 'NA' },
    {
      name: t`Turks and Caicos Islands`,
      code: 'TC',
      flag: '🇹🇨',
      cont: 'NA'
    },
    {
      name: t`Trinidad and Tobago`,
      code: 'TT',
      flag: '🇹🇹',
      cont: 'NA'
    },
    { name: t`United States`, code: 'US', flag: '🇺🇸', cont: 'NA' },
    {
      name: t`Saint Vincent and the Grenadines`,
      code: 'VC',
      flag: '🇻🇨',
      cont: 'NA'
    },
    {
      name: t`British Virgin Islands`,
      code: 'VG',
      flag: '🇻🇬',
      cont: 'NA'
    },
    {
      name: t`U.S. Virgin Islands`,
      code: 'VI',
      flag: '🇻🇮',
      cont: 'NA'
    }
  ],
  AF: [
    { name: t`Angola`, code: 'AO', flag: '🇦🇴', cont: 'AF' },
    { name: t`Burkina Faso`, code: 'BF', flag: '🇧🇫', cont: 'AF' },
    { name: t`Burundi`, code: 'BI', flag: '🇧🇮', cont: 'AF' },
    { name: t`Benin`, code: 'BJ', flag: '🇧🇯', cont: 'AF' },
    { name: t`Botswana`, code: 'BW', flag: '🇧🇼', cont: 'AF' },
    {
      name: t`Democratic Republic of the Congo`,
      code: 'CD',
      flag: '🇨🇩',
      cont: 'AF'
    },
    {
      name: t`Central African Republic`,
      code: 'CF',
      flag: '🇨🇫',
      cont: 'AF'
    },
    {
      name: t`Republic of the Congo`,
      code: 'CG',
      flag: '🇨🇬',
      cont: 'AF'
    },
    { name: t`Ivory Coast`, code: 'CI', flag: '🇨🇮', cont: 'AF' },
    { name: t`Cameroon`, code: 'CM', flag: '🇨🇲', cont: 'AF' },
    { name: t`Cape Verde`, code: 'CV', flag: '🇨🇻', cont: 'AF' },
    { name: t`Djibouti`, code: 'DJ', flag: '🇩🇯', cont: 'AF' },
    { name: t`Algeria`, code: 'DZ', flag: '🇩🇿', cont: 'AF' },
    { name: t`Egypt`, code: 'EG', flag: '🇪🇬', cont: 'AF' },
    { name: t`Western Sahara`, code: 'EH', flag: '🇪🇭', cont: 'AF' },
    { name: t`Eritrea`, code: 'ER', flag: '🇪🇷', cont: 'AF' },
    { name: t`Ethiopia`, code: 'ET', flag: '🇪🇹', cont: 'AF' },
    { name: t`Gabon`, code: 'GA', flag: '🇬🇦', cont: 'AF' },
    { name: t`Ghana`, code: 'GH', flag: '🇬🇭', cont: 'AF' },
    { name: t`Gambia`, code: 'GM', flag: '🇬🇲', cont: 'AF' },
    { name: t`Guinea`, code: 'GN', flag: '🇬🇳', cont: 'AF' },
    {
      name: t`Equatorial Guinea`,
      code: 'GQ',
      flag: '🇬🇶',
      cont: 'AF'
    },
    { name: t`Guinea-Bissau`, code: 'GW', flag: '🇬🇼', cont: 'AF' },
    { name: t`Kenya`, code: 'KE', flag: '🇰🇪', cont: 'AF' },
    { name: t`Comoros`, code: 'KM', flag: '🇰🇲', cont: 'AF' },
    { name: t`Liberia`, code: 'LR', flag: '🇱🇷', cont: 'AF' },
    { name: t`Lesotho`, code: 'LS', flag: '🇱🇸', cont: 'AF' },
    { name: t`Libya`, code: 'LY', flag: '🇱🇾', cont: 'AF' },
    { name: t`Morocco`, code: 'MA', flag: '🇲🇦', cont: 'AF' },
    { name: t`Madagascar`, code: 'MG', flag: '🇲🇬', cont: 'AF' },
    { name: t`Mali`, code: 'ML', flag: '🇲🇱', cont: 'AF' },
    { name: t`Mauritania`, code: 'MR', flag: '🇲🇷', cont: 'AF' },
    { name: t`Mauritius`, code: 'MU', flag: '🇲🇺', cont: 'AF' },
    { name: t`Malawi`, code: 'MW', flag: '🇲🇼', cont: 'AF' },
    { name: t`Mozambique`, code: 'MZ', flag: '🇲🇿', cont: 'AF' },
    { name: t`Namibia`, code: 'NA', flag: '🇳🇦', cont: 'AF' },
    { name: t`Niger`, code: 'NE', flag: '🇳🇪', cont: 'AF' },
    { name: t`Nigeria`, code: 'NG', flag: '🇳🇬', cont: 'AF' },
    { name: t`Réunion`, code: 'RE', flag: '🇷🇪', cont: 'AF' },
    { name: t`Rwanda`, code: 'RW', flag: '🇷🇼', cont: 'AF' },
    { name: t`Seychelles`, code: 'SC', flag: '🇸🇨', cont: 'AF' },
    { name: t`Sudan`, code: 'SD', flag: '🇸🇩', cont: 'AF' },
    { name: t`Saint Helena`, code: 'SH', flag: '🇸🇭', cont: 'AF' },
    { name: t`Sierra Leone`, code: 'SL', flag: '🇸🇱', cont: 'AF' },
    { name: t`Senegal`, code: 'SN', flag: '🇸🇳', cont: 'AF' },
    { name: t`Somalia`, code: 'SO', flag: '🇸🇴', cont: 'AF' },
    { name: t`South Sudan`, code: 'SS', flag: '🇸🇸', cont: 'AF' },
    {
      name: t`São Tomé and Príncipe`,
      code: 'ST',
      flag: '🇸🇹',
      cont: 'AF'
    },
    { name: t`Swaziland`, code: 'SZ', flag: '🇸🇿', cont: 'AF' },
    { name: t`Chad`, code: 'TD', flag: '🇹🇩', cont: 'AF' },
    { name: t`Togo`, code: 'TG', flag: '🇹🇬', cont: 'AF' },
    { name: t`Tunisia`, code: 'TN', flag: '🇹🇳', cont: 'AF' },
    { name: t`Tanzania`, code: 'TZ', flag: '🇹🇿', cont: 'AF' },
    { name: t`Uganda`, code: 'UG', flag: '🇺🇬', cont: 'AF' },
    { name: t`Mayotte`, code: 'YT', flag: '🇾🇹', cont: 'AF' },
    { name: t`South Africa`, code: 'ZA', flag: '🇿🇦', cont: 'AF' },
    { name: t`Zambia`, code: 'ZM', flag: '🇿🇲', cont: 'AF' },
    { name: t`Zimbabwe`, code: 'ZW', flag: '🇿🇼', cont: 'AF' }
  ],
  AN: [
    { name: t`Antarctica`, code: 'AQ', flag: '🇦🇶', cont: 'AN' },
    { name: t`Bouvet Island`, code: 'BV', flag: '🇧🇻', cont: 'AN' },
    {
      name: t`South Georgia and the South Sandwich Islands`,
      code: 'GS',
      flag: '🇬🇸',
      cont: 'AN'
    },
    {
      name: t`Heard Island and McDonald Islands`,
      code: 'HM',
      flag: '🇭🇲',
      cont: 'AN'
    },
    {
      name: t`French Southern Territories`,
      code: 'TF',
      flag: '🇹🇫',
      cont: 'AN'
    }
  ],
  SA: [
    { name: t`Argentina`, code: 'AR', flag: '🇦🇷', cont: 'SA' },
    { name: t`Bolivia`, code: 'BO', flag: '🇧🇴', cont: 'SA' },
    { name: t`Brazil`, code: 'BR', flag: '🇧🇷', cont: 'SA' },
    { name: t`Chile`, code: 'CL', flag: '🇨🇱', cont: 'SA' },
    { name: t`Colombia`, code: 'CO', flag: '🇨🇴', cont: 'SA' },
    { name: t`Ecuador`, code: 'EC', flag: '🇪🇨', cont: 'SA' },
    {
      name: t`Falkland Islands`,
      code: 'FK',
      flag: '🇫🇰',
      cont: 'SA'
    },
    { name: t`French Guiana`, code: 'GF', flag: '🇬🇫', cont: 'SA' },
    { name: t`Guyana`, code: 'GY', flag: '🇬🇾', cont: 'SA' },
    { name: t`Peru`, code: 'PE', flag: '🇵🇪', cont: 'SA' },
    { name: t`Paraguay`, code: 'PY', flag: '🇵🇾', cont: 'SA' },
    { name: t`Suriname`, code: 'SR', flag: '🇸🇷', cont: 'SA' },
    { name: t`Uruguay`, code: 'UY', flag: '🇺🇾', cont: 'SA' },
    { name: t`Venezuela`, code: 'VE', flag: '🇻🇪', cont: 'SA' }
  ],
  OC: [
    { name: t`American Samoa`, code: 'AS', flag: '🇦🇸', cont: 'OC' },
    { name: t`Australia`, code: 'AU', flag: '🇦🇺', cont: 'OC' },
    { name: t`Cook Islands`, code: 'CK', flag: '🇨🇰', cont: 'OC' },
    { name: t`Fiji`, code: 'FJ', flag: '🇫🇯', cont: 'OC' },
    { name: t`Micronesia`, code: 'FM', flag: '🇫🇲', cont: 'OC' },
    { name: t`Guam`, code: 'GU', flag: '🇬🇺', cont: 'OC' },
    { name: t`Kiribati`, code: 'KI', flag: '🇰🇮', cont: 'OC' },
    {
      name: t`Marshall Islands`,
      code: 'MH',
      flag: '🇲🇭',
      cont: 'OC'
    },
    {
      name: t`Northern Mariana Islands`,
      code: 'MP',
      flag: '🇲🇵',
      cont: 'OC'
    },
    { name: t`New Caledonia`, code: 'NC', flag: '🇳🇨', cont: 'OC' },
    { name: t`Norfolk Island`, code: 'NF', flag: '🇳🇫', cont: 'OC' },
    { name: t`Nauru`, code: 'NR', flag: '🇳🇷', cont: 'OC' },
    { name: t`Niue`, code: 'NU', flag: '🇳🇺', cont: 'OC' },
    { name: t`New Zealand`, code: 'NZ', flag: '🇳🇿', cont: 'OC' },
    {
      name: t`French Polynesia`,
      code: 'PF',
      flag: '🇵🇫',
      cont: 'OC'
    },
    {
      name: t`Papua New Guinea`,
      code: 'PG',
      flag: '🇵🇬',
      cont: 'OC'
    },
    {
      name: t`Pitcairn Islands`,
      code: 'PN',
      flag: '🇵🇳',
      cont: 'OC'
    },
    { name: t`Palau`, code: 'PW', flag: '🇵🇼', cont: 'OC' },
    {
      name: t`Solomon Islands`,
      code: 'SB',
      flag: '🇸🇧',
      cont: 'OC'
    },
    { name: t`Tokelau`, code: 'TK', flag: '🇹🇰', cont: 'OC' },
    { name: t`East Timor`, code: 'TL', flag: '🇹🇱', cont: 'OC' },
    { name: t`Tonga`, code: 'TO', flag: '🇹🇴', cont: 'OC' },
    { name: t`Tuvalu`, code: 'TV', flag: '🇹🇻', cont: 'OC' },
    {
      name: t`U.S. Minor Outlying Islands`,
      code: 'UM',
      flag: '🇺🇲',
      cont: 'OC'
    },
    { name: t`Vanuatu`, code: 'VU', flag: '🇻🇺', cont: 'OC' },
    {
      name: t`Wallis and Futuna`,
      code: 'WF',
      flag: '🇼🇫',
      cont: 'OC'
    },
    { name: t`Samoa`, code: 'WS', flag: '🇼🇸', cont: 'OC' }
  ]
}

  return data
}