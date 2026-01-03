import React, { useState, useEffect } from "react";
import { PaintbrushVertical } from "lucide-react";
import axiosInstace from "../../utils/axiosInstance";
import TagInput from "../../components/input/TagInput";

const AddEditNotes = ({ onClose, type, noteData, getAllNotes }) => {
    // States
    const [tags, setTags] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedColor, setSelectedColor] = useState('bg-blue-200 border-blue-400 text-blue-700');
    const [error1, setError1] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    // Available colors
    const colorClasses = [
        "bg-red-200 border-red-400 text-red-700",
        "bg-blue-200 border-blue-400 text-blue-700",
        "bg-green-200 border-green-400 text-green-700",
        "bg-purple-200 border-purple-400 text-purple-700"
    ];

    const toggleColor = () => {
        setSelectedColor(colorClasses[Math.floor(Math.random() * colorClasses.length)]);
    };

    // Reset state when modal opens
    useEffect(() => {
        if (type === 'add') {
            setTitle('');
            setContent('');
            setTags([]);
            setSelectedColor('bg-blue-200 border-blue-400 text-blue-700');
            setError1(false);
            setError(false);
        }

        if (type === 'edit' && noteData) {
            setTitle(noteData.title);
            setContent(noteData.content);
            setTags(noteData.tags || []);
            setSelectedColor(noteData.selectedColor || 'bg-blue-200 border-blue-400 text-blue-700');
        }
    }, [type, noteData]);


    // Add new note
    const addNewNote = async () => {
        if (!title) {
            setError1(true);
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstace.post('/add-note', {
                title,
                content,
                tags,
                selectedColor
            });

            if (response.data && response.data.note) {
                getAllNotes();
                onClose(); // close modal after successful addition
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };


    const UpdateNewNote = async () => {
        if (!title) {
            setError1(true);
            return;
        }
        setLoading(true);
        try {
            const noteId = noteData._id;
            const response = await axiosInstace.put('/edit-note/' + noteId, {
                title,
                content,
                tags,
                selectedColor
            });

            if (response.data && response.data.updatedNote) {
                getAllNotes();
                onClose();
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-[500px] flex flex-col gap-3 justify-center items-start rounded-xl">
            <label>Title :</label>
            <input
                type="text"
                className="outline-none w-full h-10 border-2 border-gray-300 rounded-lg p-5"
                placeholder="Enter the Title here"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            {error1 && <p className="text-sm text-red-400 pl-2">Enter a title</p>}

            <label>Content :</label>
            <textarea
                placeholder="Content goes here"
                className="w-full border-2 border-gray-300 rounded-lg p-2 h-42"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <label>Tags :</label>
            <div className="flex items-start gap-3">
                <div className="w-full flex-col items-start gap-2">
                    <TagInput tags={tags} setTags={setTags} colorClasses={selectedColor} />
                </div>
                <button
                    className="w-8 h-8 text-center pl-1 -mt-1 text-white bg-blue-500 hover:bg-blue-400 rounded-sm"
                    onClick={toggleColor}>
                    <PaintbrushVertical />
                </button>

            </div>

            <button
                className="w-full h-12 rounded-lg mt-2 bg-blue-500 hover:bg-blue-400 text-white"
                onClick={type === 'edit' ? UpdateNewNote : addNewNote}
                disabled={loading}
            >
                {loading ? (type === 'edit' ? "Updating..." : "Adding...") : type === 'edit' ? 'Update' : 'Add'}
            </button>
        </div>
    );
};

export default AddEditNotes;
