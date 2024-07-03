import { createHandler } from "@/utils/create";

export const handleIdentify = createHandler(async (req, res) => {
    // const { email, username }= req.body;
    res.send({
        message: 'you are here',
        status: 200,
    })
})