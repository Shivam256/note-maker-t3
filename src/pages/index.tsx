import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { Note } from "@prisma/client";

const Home: NextPage = () => {
  const [noteData, setNoteData] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: "",
  });
  const [myNotes, setMyNotes] = useState<any | null>();

  const { mutate, error } = trpc.useMutation(["notes.create-note"], {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data, "this is from the api mf!");
      setMyNotes(data);
      setNoteData({
        title: "",
        description: "",
      });
    },
  });

  const { mutate: deleteMutation } = trpc.useMutation(["notes.deleteOne"], {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data, "Delete resposne here");
      const newNotes = myNotes.filter((n:Note) => n.id != data.deleted);
      setMyNotes([...newNotes]);
    },
  });

  const handleDeleteClick = (id: string) => {
    console.log(id, "oooo");
    deleteMutation({ id });
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNoteData({
      ...noteData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    mutate(noteData);
  };

  const notes = trpc.useQuery(["notes.getAll"], {
    onSuccess: (data) => {
      setMyNotes(data);
    },
  });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="flex w-full flex-col items-center gap-8">
          <h1 className="text-2xl font-bold">
            Awesome note makeer that uses T3
          </h1>
          <input
            type="text"
            placeholder="Title"
            name="title"
            onChange={handleChange}
            value={noteData.title}
            className="w-3/5 rounded-lg border-2 border-gray-500 p-3 outline-none"
          />
          <textarea
            name="description"
            onChange={handleChange}
            value={noteData.description}
            id=""
            cols={20}
            rows={5}
            placeholder="Description"
            className="w-3/5 rounded-lg border-2 border-gray-500 p-3 outline-none"
          ></textarea>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white"
          >
            ADD NOTE
          </button>
        </div>
        <div className="mt-5 flex w-full flex-wrap gap-8">
          {myNotes?.length > 0 &&
            myNotes?.map((note: Note) => (
              <div className="transitiona-all w-56  p-4 shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl">
                <div className="text-2xl font-bold">{note.title}</div>
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
            ))}
        </div>

        {/* <div className="flex w-full items-center justify-center pt-6 text-2xl text-blue-500">
          {hello.data ? <p>{hello.data.greeting}</p> : <p>Loading..</p>}
        </div> */}
      </main>
    </>
  );
};

export default Home;
