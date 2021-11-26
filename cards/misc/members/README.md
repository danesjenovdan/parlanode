# State parameters

### page
- type: Number
- default: `1`

### groups
// to do //

### showWorkingBodiesFilter
- type: Boolean
- default: `'true'`

### showGendersFilter
- type: Boolean
- default: `'true'`

### showDemographicsAge
- type: Boolean
- default: `'true'`

### showDemographicsEducation
- type: Boolean
- default: `'true'`

### showDemographicsMandates
- type: Boolean
- default: `'true'`

### showDemographicsGroup
- type: Boolean
- default: `'true'`

### workingBodies
// to do //

### text
Initial filter text.
- type: String
- default: `''`

### analysis
The selected tab.
* type: String
* default: `'demographics'`
* options:
    * `'demographics'`
    * `'presence_votes'`
    * `'number_of_questions'`
    * `'speeches_per_session'`
    * `'working_bodies'`
  
### genders
- type: Array
- default: `[]`
- array elements options: `'he'`, `'she'`

### sort
- type: String 
- default: `'name'`
- options:
    * `'name'`
    * `'age'`
    * `'education'`
    * `'terms'`
    * `'party'`
    * `'analysis'`

### sortOrder
- type: String
- default: `'asc'`
- options: 
    * `'asc'`
    * `'desc'`
