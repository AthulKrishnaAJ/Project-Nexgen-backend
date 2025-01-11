import app from "./frameworks/webserver/server";

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log('server listen on port number: ', port)
}).on('error',  (err: any) => {
    if(err.code === 'EADDRINUSE') {
        console.log(`Port ${port} already in use: `, err)
        process.exit(1)
    } else {
        throw err.message
    }
})
