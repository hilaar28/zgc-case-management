
# API Design

- Unless stated otherise, all endpoints requires a valid `openstack-xavisoft-access-token ` token as a header, otherwise they return `Error 401`

**Exceptions**:
- Login

## Login
**POST** `/api/login`

*expects**:
```js
// body
{
   email: String,
   password: String, 
}
```

**returns**:
```js
// headers
{
   "openstack-xavisoft-access-token": String,
   "openstack-xavisoft-refresh-token": String,
}
```

## User management
**Security policy**: Only users with the role of `super user` can use this endpoints.

### Add user
**POST** `/api/users`
**expects**:

```js
// body
{
   name: String,
   surname: String,
   email: String,
   role: String, // enum
}
```

**returns**:

```js
// body
{
   _id: String,
}
```

### Retrieve users
**GET** `/api/users`

**returns**:
```js
// body
[
   {
      _id: String,
      name: String,
      surname: String,
      email: String,
      role: String,
   },
   ...
]
```

### Update user
**PATCH** `/api/users/:id`

**expects**:
```js
// body
{
   set: {
      name: String,
      surname: String,
      email: String,
      role: String, // enum
   }
}
```

### Remove user
**DELETE** `/api/users/:id`

## Account management
### Get account data
**GET** `/api/accounts`

**returns**:
```js
// body
{
   _id: String,
   name: String,
   surname: String,
   email: String,
   role: String,
}
```

### Update password
**POST** `/api/accounts/new-password`

**expects**:
```js
//body
{
   old_password: String,
   new_password: String,
}
```

### Reset password
**POST** `/api/accounts/password-reset`

**expects**:
```js
// body
{
   email: String
}
```

### Verify password reset
**POST** `/api/accounts/password-reset/:ref_code/verification`

## Case management
### Record case
**POST** `/api/cases`
**expects**:
```js

{
   applicant: {
      name: String,
      surname: String,
      national_id: String,      
      dob: String, // datestring,
      place_of_birth: String,
      gender: String, // enum
      marital_status: String,
      residential_address: String,
      work_address: String,
      postal_address: String,
      telephone: String,
      mobile: String,
      fax: String,
      email: String,
      next_of_kin_phone: String,
      friend_phone: String,
      location: String,
      institution_name: String,
      relationship_to_victim: String,
      relationship_to_incident: String,
      why_completing_form_on_behalf: String,
   },
   victim: {
      name: String,
      surname: String,
      national_id: String,  
      dob: String, // datestring,
      place_of_birth: String,
      gender: String, // enum
      marital_status: String,
      residential_address: String,
      work_address: String,
      postal_address: String,
      telephone: String,
      mobile: String,
      fax: String,
      email: String,
      next_of_kin_phone: String,
      friend_phone: String,
   },
   defendant: {
      name: String,
      surname: String,
      national_id: String,      
      dob: String, // datestring,
      place_of_birth: String,
      gender: String, // enum
      marital_status: String,
      residential_address: String,
      work_address: String,
      postal_address: String,
      telephone: String,
      mobile: String,
      fax: String,
      email: String,
      next_of_kin_phone: String,
      friend_phone: String,
      institution_name: String,
   },
   violation: {
      date: String | Array<String>,
      continuing: Boolean,
      nature: String,
      nature_gender: String,
      details: String,
      location: String,
      witness_details: String,
   },
   other_entity_reported_to: {
      details: String,
      actions: String,
      why_reporting_to_us_as_well: String,
   },
   why_violation_is_important_to_our_mandate: String,
   expectations_from_us: String,
   lawyer_details: String,
   language: String,
   who_referred_you_to_us: String,
   source: String,
   title: String,
}
```

**returns**:
```js
// body
{
   _id: String
}
```

### Retrieve cases
**GET** `/api/cases/?offset=:offset&limit=:limit`

```js
// body
[
   {
      _id: String,
      title: String,
      applicant: {
         name: String,
         surname: String,
      },
      victim: {
         name: String,
         surname: String,
      },
      defendant: {
         name: String,
         surname: String,
      },
      violation: {
         details: String,
      },
      status: String,
      recorded_by: {
         _id: String,
         name: String,
         surname: String,
      },
      case_officer: {
         _id: String,
         name: String,
         surname: String,
      },
   },
   ...
]
```

### Retrieve case
**GET** `/api/cases/:id`

**returns**:
```js
// body
{
   ..., // case entity attributes
   status: String,
   recorded_by: {
      _id: String,
      name: String,
      surname: String,
   },
   case_officer: {
      _id: String,
      name: String,
      surname: String,
   },
   referred_to: String,
   createdAt: Date,
   updates: [
      {
         _id: String,
         description: String,
         createdAt: Date,
      },
      ...
   ]
}
```

### Update case status
**POST** `/api/cases/:id/status`

**expects**:
```js
// body
{
   status: String,
}
```


### Assign case to officer
**POST** `/api/cases/:id/assignment`

**expects**:
```js
// body
{
   case_officer: String,
}
```


### Update case
**PATCH** `/api/cases/:id`

**expects**:
```js
//body
{
   set: {
      ... // any of the case entity attribute
   }
}
```

### Refer case
**POST** `/api/cases/:id/referral`
**expects**:
```js
// body
{
   refer_to: String,
}
```

### Case updates
**Security Policy**: These endpoints require the user to be the case officer assigned to the case, otherwise return `Error 403`

#### Add an update to a case
**POST** `/api/cases/:id/updates`

**expects**:
```js
// body
{
   description: String,
}
```

**returns**:
```js
// body
{
   _id: String,
}
```

#### Edit case update
**PATCH** `/api/cases/:caseId/updates/:updateId`

**expects**:
```js
// body
{
   set: {
      description: String,
   }
}
```

#### Delete case update
**DELETE** `/api/cases/:caseId/updates/:updateId`


## Reports
### Get case trend data
**GET** `/api/cases/trend?from=:from&to=:to&period=:period`

**returns**:
```js
// body
[
   {
      start: Date,
      count: Number,
   },
   ...
]
```

### Get case summary statistics
**GET** `/api/cases/summary?from=:from&to=:to`

**returns**:
```js
// body
{
   gender: {
      male: Number,
      female: Number,
   },
   province: {
      "Harare Metropolitan": Number,
      ...
   },
   status: {
      REJECTED: Number,
      ...
   }
}
```

