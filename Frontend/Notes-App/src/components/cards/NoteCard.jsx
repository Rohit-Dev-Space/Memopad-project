import React from "react";
import { ClockPlus, Pencil, Pin, Trash } from "lucide-react";
import { useState } from "react";

const NoteCard = ({
    type = '',
    title = "",
    date = "",
    content = "",
    tags = [],
    PinnedOrNot = false,
    isPinned = () => { },
    selectedColor = "",
    onEdit = () => { },
    onDelete = () => { },
    reminder = () => { },
    reminderDate = "",
    reminderTime = "",
    deleteReminder = () => { },
}) => {

    return (
        <div className={`w-2/7 h-fit mt-10 border-2 p-5 ${type === 'reminder' ? 'pt-5' : 'pt-1'} border-gray-300 rounded-xl hover:shadow-2xl space-y-5`}>
            <div className="w-full px-2 h-auto flex justify-between pb-3 items-start gap-6">
                <div className="flex flex-col justify-start gap-2">
                    <h4>{type !== 'reminder' ? '' : 'Title : '} <br /> {title}</h4>
                    <p className="text-slate-500 text-sm">{type === 'reminder' ? '' : 'Created on :'}{type === 'reminder' ? "" : date}</p>
                </div>
                {type !== 'reminder' && <button className="cursor-pointer mt-8" onClick={isPinned}>{PinnedOrNot ? <Pin className="text-blue-400" /> : <Pin />}</button>}
            </div>

            <p className="text-sm px-2">{content}</p>
            {type === 'reminder' &&
                (
                    <>
                        <p className="text-sm text-black px-5">Reminder Date : <br />{reminderDate}</p>
                        <p className="text-sm text-black px-5">Reminder Time : <br />{reminderTime}</p>
                    </>
                )
            }

            <div className="px-1 flex justify-between items-center">
                <div className="flex w-full flex-wrap items-center gap-2">
                    {tags.map((item, index) => (
                        <span key={index} className={`rounded-2xl ${selectedColor} border-2 p-1 px-2`}>#{item}</span>
                    ))}
                </div>

                <div className={`${type === 'reminder' ? 'w-full h-auto' : ''}flex gap-4 pt-2`}>
                    {type !== 'reminder' && <button className="cursor-pointer text-slate-600" onClick={reminder}><ClockPlus /></button>}
                    <button className={`${type === 'reminder' ? 'w-full h-auto flex p-1 mb-2 justify-center rounded-lg text-white bg-blue-400' : ''} cursor-pointer text-slate-600`} onClick={type === 'reminder' ? reminder : onEdit}><Pencil /></button>
                    <button className={`${type === 'reminder' ? 'w-full h-auto flex p-1 mb-2 justify-center rounded-lg text-white bg-red-400' : ''} cursor-pointer text-slate-600`} onClick={type === 'reminder' ? deleteReminder : onDelete}><Trash /></button>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
