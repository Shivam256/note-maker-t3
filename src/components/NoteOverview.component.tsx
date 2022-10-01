import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { trpc } from "../utils/trpc";
import { Note } from "@prisma/client";

interface Props {
  note: Note;
  myNotes: Array<any>;
  setMyNotes: Function;
}

const NoteOverview = ({ note, myNotes, setMyNotes }: Props) => {
  const [special, setSpecial] = useState<Boolean>(note.isSpecial);
  const { mutate: deleteMutation } = trpc.useMutation(["notes.deleteOne"], {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data, "Delete resposne here");
      const newNotes = myNotes.filter((n: Note) => n.id != data.deleted);
      setMyNotes([...newNotes]);
    },
  });

  const { mutate: toggleStarMutation } = trpc.useMutation(
    ["notes.toggleStar"],
    {
      onError: (err) => {
        console.log(err);
      },
      onSuccess: (data: any) => {
        console.log("data", "star toggleData");
      },
    }
  );

  const handleDeleteClick = (id: string) => {
    console.log(id, "oooo");
    deleteMutation({ id });
  };

  return (
    <div className="transitiona-all w-56  p-4 shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl">
      <div className="flex w-full items-center justify-between">
        <div className="text-2xl font-bold">{note.title}</div>
        {special ? (
          <Icon
            icon="ant-design:star-filled"
            className="cursor-pointer"
            onClick={() => {
              setSpecial(!special);
              toggleStarMutation({
                id: note.id,
                val: !note.isSpecial,
              });
            }}
          />
        ) : (
          <Icon
            icon="ant-design:star-outlined"
            className="cursor-pointer"
            onClick={() => {
              setSpecial(!special);
              toggleStarMutation({
                id: note.id,
                val: !note.isSpecial,
              });
            }}
          />
        )}
      </div>

      <div>{note.description}</div>

      <button
        className="mt-5 rounded-md border-2 border-red-500 px-4 py-0.5 text-sm text-red-500 transition-all duration-100 ease-out hover:bg-red-500 hover:text-white"
        onClick={() => {
          handleDeleteClick(note.id);
        }}
      >
        DELETE
      </button>
    </div>
  );
};

export default NoteOverview;
