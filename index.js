var csv = require('csv-parser')
var fs = require('fs')
var template = `dn: uid=%USERNAME%,ou=crpb,ou=voel,dc=voel,dc=ru
objectclass: inetOrgPerson
objectclass: posixAccount
objectclass: top
givenName: %NAME%
sn: %FAMILY%
displayName: %FULLNAME%
cn: %FULLNAME%
uid: %USERNAME%
uidNumber: 1100
gidNumber: 1100
homeDirectory: /home/%USERNAME%
mail: %EMAIL%
o: %COMPANY%
l: %CITY%
title: %PROFESSION%
`

fs.createReadStream('jmes_ldif.csv')
  .pipe(csv({
      separator: ';'
  }))
  .on('data', function (data) {
      fs.writeFile('out/'+ parseUsername(data.EMAIL) +'.ldif', dataReplace(template,data), (err) => {
        if (err) throw err;
        console.log('The file '+ parseUsername(data.EMAIL) +' has been saved!');
      });
})

function parseUsername(e){
    var pattern = /(\w{0,}.\w{0,})(?=@(corp.|jmes.|mmes.|prmes.|smes.|surmes.|kmes.|zmes.)voel.ru)/g
    return e.match(pattern)
}

function dataReplace(template, data){
    template = template.replace(/%EMAIL%/g, data.EMAIL)
    template = template.replace(/%USERNAME%/g, parseUsername(data.EMAIL))
    template = template.replace(/%NAME%/g, data.NAME)
    template = template.replace(/%FAMILY%/g, data.FAMILY)
    template = template.replace(/%FULLNAME%/g, data.FULLNAME)
    template = template.replace(/%COMPANY%/g, data.COMPANY)
    template = template.replace(/%CITY%/g, data.CITY)
    template = template.replace(/%PROFESSION%/g, data.PROFESSION)
    return template
}