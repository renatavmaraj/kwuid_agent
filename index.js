const faker = require('faker');
const fs = require('fs');

fs.readFile('./perftest-agents.csv', 'utf8', (err, data) => {
    if (err) process.exit(1);
    const [headers, ...rows] = data.split('\n');

    // remove the last line
    rows.pop();

    const result = rows.map(row => {
        const [kw_uid, firstName, lastName, username, password] = row.split(',');
        return JSON.stringify(generateAgent({ kw_uid, firstName, lastName, username, password }), null, 4);
    });
    
    fs.writeFile('agents.json', result, (err) => {
        if (err) process.exit(1);
        console.log('All done!');
    });
}); 

const agentModel = {
    "foreignKeys": [
        {
            "key": "kwuid",
        }
    ],
    "@type": "profile.agent",
    "changes": {},
    "extraction": {
        "startDate": "1988-06-20T12:06:00Z",
        "numberOfSales": null,
        "bio": null,
        "languages": null,
        "contactMethods": [
            {
                "method": "LANDLINE",
            },
            {
                "method": "MOBILE",
            }
        ]
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
    ]
};

function generateAgent(row) {
    const person = { ...agentModel }
    person['foreignKeys'][0]['value'] = row.kw_uid;
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
