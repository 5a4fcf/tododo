import prisma from "../../lib/prisma";

export default async (req, res) => {
    const { body } = req;

    if (!['POST', 'DELETE', 'PUT'].includes(req.method)) {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const todoList = body;
        if (req.method === 'POST') {
            const savedToDoList = await prisma.todoList.create({ data: todoList });
            res.status(200).json(savedToDoList);
        } else if (req.method === 'PUT') {
            await prisma.todoList.update({
                where: {
                    id: todoList.id
                },
                data: todoList
            });
            res.status(200).json({ message: 'Item updated!' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};