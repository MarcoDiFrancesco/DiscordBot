module.exports = {
    name: "ping",
    category: "info",
    description: "Returns latency of the server",
    run: async (client, message, args) =>{
        const new_message = await message.channel.send("Pinging...");
        new_message.edit(`Pong\Loalded in ${Math.floor(new_message.createdAt - message.createdAt)}, API latency ${Math.round(client.ping)}ms`);
    }
}