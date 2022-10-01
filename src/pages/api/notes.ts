import type {NextApiRequest,NextApiResponse} from 'next';
import {prisma} from '../../server/db/client';

const notes = async (req:NextApiRequest,res:NextApiResponse) => {
    const notes = await prisma.note.findMany();
    console.log(notes,"here are the notes");
    res.status(200).json(notes);
};


export default notes;