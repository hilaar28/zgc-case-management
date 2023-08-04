

const USER_ROLES = {
   AGENT: 'agent',
   CASE_OFFICER: 'case_officer',
   INVESTIGATING_OFFICER: 'investigating_officer',
   SUPERVISOR: 'supervisor',
   SUPER_ADMIN: 'super_admin',
}

const GENDER = {
   MALE: 'M',
   FEMALE: 'F',
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
   REFERRED: 'REFERRED',
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
   RAPE: 'rape',
   ASSAULT: 'assault',
   MALICIOUS_DAMAGE_TO_PROPERTY: 'malicious_damage_to_property',
   UNLAWFUL_ARREST: 'unlawful_arrest',
   UNLAWFUL_DETENTION: 'unlawful_detention',
   ABDUCTION: 'abduction',
   HOMICIDE: 'homicide',   
}

const GENDER_VIOLATION_NATURE = {
   PHYSICAL_ASSAULT: 'physical_assault',
   SEXUAL_HARASSMENT: 'sexual_harassment',
   VERBAL_ABUSE: 'verbal_abuse',
   EMOTIONAL_ABUSE: 'emotional_abuse',
   INTIMIDATION: 'intimidation',
   DISCRIMINATION: 'discrimination',
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
}

module.exports = {
   CASE_SOURCES,
   CASE_STATUS,
   GENDER,
   GENDER_VIOLATION_NATURE,
   MARITAL_STATUS,
   PROVINCES,
   RELATIONSHIP_TO_INCIDENT,
   USER_ROLES,
   VIOLATION_IMPACT,
   VIOLATION_NATURE,
}