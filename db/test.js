const fs = require('fs')
//读数据库
const userString = fs.readFileSync('./db/users.json').toString()
const userArray = JSON.parse(userString) //反序列化 字符串=>数组
console.log(typeof userString)
console.log(userString)
console.log(typeof userArray)
console.log(userArray)

//存储(写)数据库
const users3 = { name: "小绿", age: 18, gender: "男" }
userArray.push(users3)
const user3String = JSON.stringify(userArray)
console.log(typeof user3String)
fs.writeFileSync('./db/users.json', user3String)