import app from "./frameworks/webserver/server";
import net from 'net';

const PORT = process.env.PORT || 9009;

// Check if the port is already in use
const server = net.createServer();
server.once("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use!`);
        process.exit(1);
    } else {
        throw err;
    }
});

server.once("listening", () => {
    server.close();
    // Start the Express app once the port is confirmed to be free
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

server.listen(PORT);
