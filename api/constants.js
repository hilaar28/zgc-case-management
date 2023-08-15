

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
   MASVINGO: 'Masvingo',
   HARARE: 'Harare',
   BULAWAYO: 'Bulawayo',
   MIDLANDS: 'Midlands',
   MANICALAND: 'Manicaland',
   MASH_EAST: 'Mashonaland East',
   MASH_CENTRAL: 'Mashonaland Central',
   MASH_WEST: 'Mashonaland West',
   MAT_SOUTH: 'Matebeleland South',
   MAT_NORTH: 'Matebeleland North',
};


const VIOLATION_NATURE = {
   THREAT: [],
   ASSAULT: [
      'Foot whipping',
      'Submersion/Suffocation',
      'Beating',
   ],
   SEXUAL_ASSAULT: [
      'Rape',
      'Aggravated indecent sexual assault',
   ],
   PROPERTY_VIOLATION: [
      'Theft',
      'Robbery',
      'Stock theft',
      'Malicious damage to property',
      'Destruction of home',
   ],
   MOVEMENT_VIOLATION: [
      'Abduction',
      'Unlawful Arrest',
      'Unlawful Detention',
      'Forced Displacement',
   ],
   LABOUR_VIOLATION: [
      'Forced (Physical) Labour',
   ],
   DENIAL_OF_ACCESS_TO_RIGHTS: [
      'Denial of Access to Education',
      'Denial of Access to Food (Water)',
      'Denial of Access to Health Care',
   ]
}

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