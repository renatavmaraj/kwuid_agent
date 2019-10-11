const faker = require('faker');
const fs = require('fs');
const jsonfile = require('jsonfile')
const csv = require('csv-parser'); 

let final = new Array();

fs.createReadStream('./perftest-agents.csv')
.pipe(csv())
.on('data', function(row){
    try {
        final.push(generateAgent(row));
    }
    catch(err) {
        //error handler
        console.log("ERR",err)
    }
})
.on('end',function(){
    //some final operation
    jsonfile.writeFileSync('./agents.json', final, { flag: 'a', spaces: 2 })
});  

let KWUID_VALUE, FIRST_NAME, LAST_NAME, LANDLINE_NUMBER, MOBILE_NUMBER;
let FULL_NAME_LOWERCASE, CITY_LOWER_CASE, AVATAR, UPA_ID;

let agentModel = {
    "foreignKeys": [
        {
            "key": "kwuid",
            "value": KWUID_VALUE
        }
    ],
    "@type": "profile.agent",
    "changes": {},
    "extraction": {
        "firstName": FIRST_NAME,
        "lastName": LAST_NAME,
        "kwuid": KWUID_VALUE,
        "startDate": "1988-06-20T12:06:00Z",
        "numberOfSales": null,
        "bio": null,
        "languages": null,
        "contactMethods": [
            {
                "method": "LANDLINE",
                "value": LANDLINE_NUMBER
            },
            {
                "method": "MOBILE",
                "value": MOBILE_NUMBER
            }
        ],
        "fullnameLowerCase": FULL_NAME_LOWERCASE,
        "cityLowerCase": CITY_LOWER_CASE,
        "avatar": AVATAR
    },
    "facet": [
        {
            "LANGUAGES": null,
            "SPECIALTIES": null,
            "DESIGNATIONS": null,
            "FULLNAME": null,
            "ZIPCODE": null,
            "CITY": null,
            "STATE": null
        }
    ],
    "id": `UPA-${UPA_ID}`
};


function generateAgent(row) {
    let person = { ...agentModel }
    person['foreignKeys'][0]['value']= row.kw_uid;
    person['extraction']['firstName']= row.firstName ? row.firstName : faker.name.firstName();
    person['extraction']['lastName'] = row.lastName ? row.lastName : faker.name.lastName();
    person['extraction']['kwuid'] = row.kw_uid;
    person['extraction']['contactMethods'][0]['value'] = faker.phone.phoneNumber()
    person['extraction']['contactMethods'][1]['value'] = faker.phone.phoneNumber()
    person['extraction']['fullnameLowerCase'] = person['extraction']['firstName'] + " " + person['extraction']['lastName']
    person['extraction']['cityLowerCase'] = faker.address.city().toLowerCase();
    person['extraction']['avatar'] = faker.address.city().toLowerCase();
    person['id'] = `UPA-${faker.random.number().toString()}`;
    return person;
}
