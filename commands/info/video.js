module.exports = {
    name: "video",
    category: "info",
    description: "Returns a video",
    run: async (client, message, args) =>{
        const new_message = await message.channel.send("https://www.youtube.com/watch?v=EXBGRxmLqOU");
    }
}