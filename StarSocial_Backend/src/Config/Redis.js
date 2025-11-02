import { createClient } from 'redis';

const client = createClient({
    username: process.env.Regis_Username,
    password: process.env.Redis_Password,
    socket: {
        host: process.env.Redis_Host,
        port: process.env.Redis_Port
    }
});

client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log("Connect regis successfully"+result)  // >>> bar

const clientConnection = async () => {
    try {
        await client.connect();
        console.log("Kết nối đến Redis thành công!");
    } catch (err) {
        console.error("Lỗi kết nối đến Redis:", err);
        throw err;
    }
};
export {client,clientConnection};

