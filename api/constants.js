

const USER_ROLES = {
   AGENT: 'agent',
   CASE_OFFICER: 'case_officer',
   INVESTIGATING_OFFICER: 'investigating_officer',
   SUPERVISOR: 'supervisor',
   SUPER_ADMIN: 'super_admin',
}

const GENDER = {
   MALE: 'Male',
   FEMALE: 'Female',
}

const MARITAL_STATUS = {
   MARRIED: 'MARRIED',
   WIDOWED: 'WIDOWED',
   SEPARATED: 'SEPARATED',
   DIVORCED: 'DIVORCED',
   SINGLE: 'SINGLE',
}

const CASE_SOURCES = {
   CALL_CENTER: 'CALL_CENTER',
   WALK_IN: 'WALK_IN',
   EMAIL: 'EMAIL',
   MAIL: 'MAIL',
   FIELD_FORM: 'FIELD_FORM',
   OTHER: 'OTHER',
}

const CASE_STATUS = {
   NOT_ASSESSED: 'NOT_ASSESSED',
   REJECTED: 'REJECTED',
   NOT_ASSIGNED: 'NOT_ASSIGNED',
   IN_PROGRESS: 'IN_PROGRESS',
   RESOLVED: 'RESOLVED',
}

const PROVINCES = {
   MASVINGO: [
      'Masvingo',
      'Gutu',
      'Zaka',
      'Chiredzi',
      'Bikita',
      'Mwenezi',
      'Chivi',
   ],
   HARARE_METROPOLITAN: [
      'Harare Urban',
      'Harare Rural',
      'Chitungwiza',
      'Epworth',
   ],
   BULAWAYO_METROPOLITAN: [
      'Bulawayo Central',
      'Imbizo',
      'Khami',
      'Mzilikazi',
      'Reigate',
   ],
   MIDLANDS: [
      'Chirumhanzu',
      'Gokwe North',
      'Gokwe South',
      'Gweru',
      'Kwekwe',
      'Mberengwa',
      'Shurugwi',
      'Zvishavane',
   ],
   MANICALAND: [
      'Buhera',
      'Chipinge',
      'Chimanimani',
      'Mutare District',
      'Mutare City Council',
      'Makoni',
      'Mutasa',
      'Nyanga',
   ],
   MASHONALAND_EAST: [
      'Chikomba',
      'Goromonzi',
      'Marondera',
      'Mudzi',
      'Murehwa (Mrehwa)',
      'Mutoko',
      'Seke',
      'Uzumba-Maramba-Pfungwe (UMP)',
      'Wedza (Hwedza)',
   ],
   MASHONALAND_CENTRAL: [
      'Bindura',
      'Shamva',
      'Mbire',
      'Mt Darwin',
      'Rushinga',
      'Mazoe',
      'Muzarabani',
      'Guruve',
   ],
   MASHONALAND_WEST: [
      'Chegutu',
      'Hurungwe',
      'Kariba',
      'Makonde',
      'Mhondoro-Ngezi',
   ],
   MATEBELELAND_SOUTH: [
      'Beitbridge',
      'Bulilima',
      'Gwanda',
      'Insiza',
      'Mangwe',
      'Matobo',
      'Umzingwane',
   ],
   MATEBELELAND_NORTH: [
      'Bubi',
      'Hwange',
      'Nkayi',
      'Lupane',
      'Tsholotsho',
      'Umguzu',
   ],
};


const VIOLATION_NATURE = [
   'THREAT',
   'PHYSICAL_ASSAULT',
   'SEXUAL_ASSAULT',
   'LABOUR_VIOLATION',
   'DENIAL_OF_ACCESS_TO_RIGHTS',
   'HOMICIDE',
   'DISCRIMINATION',
   'INTIMIDATION',
   'MALICIOUS_DAMAGE_TO_PROPERTY',
   'UNLAWFUL_DETENTION',
   'UNLAWFUL_ARREST',
   'ABDUCTION',
   'RAPE',
]

const RELATIONSHIP_TO_INCIDENT = {
   VICTIM: 'victim',
   WITNESS: 'witness',
   ELECTION_OBSERVER: 'election_observer',
}

const VIOLATION_IMPACT = {
   PHYSICAL_INJURY: 'physical_injury',
   DEATH: 'death',
   DESTITUTION: 'destitution',
   DISABILITY: 'disability',
}

const TREND_PERIODS = {
   WEEKLY: 'WEEKLY',
   MONTHLY: 'MONTHLY',
}


const AGE_RANGES = [
   '<18',
   '18_24',
   '25_34',
   '35_44',
   '45_54',
   '55_64',
   '65+',
]

module.exports = {
   AGE_RANGES,
   CASE_SOURCES,
   CASE_STATUS,
   GENDER,
   MARITAL_STATUS,
   PROVINCES,
   RELATIONSHIP_TO_INCIDENT,
   TREND_PERIODS,
   USER_ROLES,
   VIOLATION_IMPACT,
   VIOLATION_NATURE,
}