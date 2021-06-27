import prisma from "../../lib/prisma";

export default async (req, res) => {
    const { body } = req;

    if (!['POST', 'DELETE', 'PUT'].includes(req.method)) {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        if (req.method === 'POST') {
            const savedItem = await prisma.todoItem.create({ data: body });
            res.status(200).json(savedItem);
        } else if (req.method === 'DELETE') {
            await prisma.todoItem.delete({
                where: {
                    id: body.id
                }
            });
            res.status(200).json({ message: 'Item deleted!' });
        } else if (req.method === 'PUT') {
            await prisma.todoItem.update({
                where: {
                    id: body.id
                },
                data: body
            });
            res.status(200).json({ message: 'Item updated!' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};