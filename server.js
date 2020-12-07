var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method

    /******** 从这里开始看，上面不要看 ************/
    console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)

    if (path === '/sign_in') {
        response.setHeader('Content-Type', 'text/html; charset=UTF-8')
        const userArray = JSON.parse(fs.readFileSync('./db/users1.json'))
        const array = []
        request.on('data', (chunk) => { //data传给chunk
            array.push(chunk)
        })
        request.on('end', () => {
            const string = Buffer.concat(array).toString() //将字符编码转换为字符串
            const obj = JSON.parse(string)
            const user = userArray.find((user) => user.name === obj.name && user.password === obj.password)
            if (user === undefined) {
                response.statusCode = 400
                response.end('name password 不匹配')
            } else {
                response.statusCode = 200
                response.end()
            }
        })

    } else if (path === '/home') {
        //写不出来
    } else if (path === '/register' && method === 'POST') {
        response.setHeader('Content-Type', 'text/html; charset=UTF-8')
        const userArray = JSON.parse(fs.readFileSync('./db/users1.json'))
        const array = []
        request.on('data', (chunk) => { //data传给chunk
            array.push(chunk)
        })
        request.on('end', () => {
            const string = Buffer.concat(array).toString() //将字符编码转换为字符串
            const obj = JSON.parse(string)
            console.log(obj.name)
            console.log(obj.password)
            const lasterUser = userArray[userArray.length - 1]
            const newUser = {
                id: lasterUser ? lasterUser.id + 1 : 1,
                name: obj.name,
                password: obj.password
            }
            userArray.push(newUser)
            fs.writeFileSync('./db/users1.json', JSON.stringify(userArray))
            response.end()
        })

    } else {
        response.statusCode = 200
        const filePath = path === '/' ? '/index.html' : path //默认为登录页sign_in.html

        const index = filePath.lastIndexOf('.') //获取最后一个点的下标
        //suffix是后缀
        const suffix = filePath.substring(index) //获取index的子节点

        const fileTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg'
        }
        response.setHeader('Content-Type', `${fileTypes[suffix] || 'text/html'};charset=utf-8`)
        let content
        try {
            content = fs.readFileSync(`db${filePath}`)
        } catch (error) {
            content = `文件不存在`
            response.statusCode = 404
        }
        response.write(content)
        response.end()

    }


    /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)