

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
   IN_PROGRESS: 'IN_PROGRESSED',
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

module.exports = {
   CASE_SOURCES,
   CASE_STATUS,
   GENDER,
   MARITAL_STATUS,
   PROVINCES,
   USER_ROLES,
}