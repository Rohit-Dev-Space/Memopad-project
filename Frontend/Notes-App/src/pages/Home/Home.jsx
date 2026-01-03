import React, { useEffect, useState } from "react";
import ProfileInfo from "../../components/cards/ProfileInfo";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/cards/NoteCard";
import { BellRing, ChevronRight, CirclePlus, Mails, MessageSquarePlus, MessageSquareX, NotepadText, PersonStanding, Plus, RotateCcw, ScrollText, Search, Send, Shredder, Trash, X } from "lucide-react";
import AddEditNotes from "./AddEditNotes";
import moment from "moment";
import Modal from "react-modal"
import { useNavigate } from "react-router-dom";
import axiosInstace from "../../utils/axiosInstance";

const Home = () => {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null
    });
    const [openReminderModal, setOpenReminderModal] = useState({
        isShown: false
    });
    const [userInfo, setUserInfo] = useState(null);
    const [allNotes, setAllNotes] = useState([]);
    const [receviedNotes, setReceviedNotes] = useState([]);
    const [archivedNotes, setArchivedNotes] = useState([]);
    const [Rnotes, setRnotes] = useState([])
    const [searchEmail, setSearchEmail] = useState('')
    const [sendTitle, setSendTitle] = useState('')
    const [sendContent, setSendContent] = useState('')
    const [isSearch, setIsSearch] = useState(false);
    const [clicked1, setClicked1] = useState(false);
    const [clicked2, setClicked2] = useState(false);
    const [clicked3, setClicked3] = useState(true);
    const [clicked4, setClicked4] = useState(false);
    const [clicked5, setClicked5] = useState(false);
    const [disabled, setDisabled] = useState(false)
    const [reminderDate, setReminderDate] = useState("");
    const [reminderTime, setReminderTime] = useState("");
    const [noteId, setNoteId] = useState(null);
    const navigate = useNavigate();

    const getUserInfo = async () => {
        try {
            const response = await axiosInstace.get('/get-users');
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.clear();
                navigate('/');
            }
        }
    };

    const getReminderNotes = async () => {
        try {
            const response = await axiosInstace.get('/get-reminder')
            if (response.data && response.data.reminder) {
                setRnotes(response.data.reminder);
                console.log('Reminders:', response.data.reminder)
            }
        } catch {
            if (error.response && error.response.status === 401) {
                console.log('No remiders')
            }
        }
    }

    const [sentBy, setSentBy] = useState(userInfo?.name || "");

    const handleEdit = (note) => {
        setOpenAddEditModal({ isShown: true, type: 'edit', data: note });
    }

    const getAllNotes = async () => {
        try {
            const response = await axiosInstace.get('/getAll-notes');
            if (response.data && response.data.getAll) {
                setAllNotes(response.data.getAll);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getRecivedNotes = async () => {
        try {
            const response = await axiosInstace.get('/get-sentNotes')
            if (response.data && response.data.getnotes) {
                setReceviedNotes(response.data.getnotes);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getArchivedNotes = async () => {
        try {
            const response = await axiosInstace.get('/archive-notes');
            if (response.data && response.data.archivedNotes) {
                setArchivedNotes(response.data.archivedNotes);
            }
        } catch (error) {
            console.log(error);
        }
    };


    const deleteNote = async (ID) => {

        try {
            const response = await axiosInstace.delete('/delete-notes/' + ID)

            if (response.data && response.data.deleted) {
                getAllNotes();
                getArchivedNotes();
            }
        } catch (err) {
            console.log(err)
        }
    }

    const deleteMsg = async (ID) => {

        try {
            const response = await axiosInstace.delete('/delete-message/' + ID)

            if (response.data && response.data.deleted) {
                getRecivedNotes();
            }
        } catch (err) {
            console.log(err)
        }
    }

    const deleteReminder = async (id) => {
        setReminderDate('')
        setReminderTime('')

        const deleted = await axiosInstace.put(`/delete-reminder/${id}`, { reminderDate, reminderTime, isReminderActive: false })

        if (deleted.data && deleted.data.deletedReminder) {
            getReminderNotes();
        }
    }

    const sendNotes = async () => {
        try {
            const response = await axiosInstace.post('/send-note', {
                sendTitle,
                sendContent,
                searchEmail,
                sentBy: userInfo?.name || "Anonymous"
            });

            alert('Note sent successfully!');
            setSendContent("")
            setSendTitle("")
            setSearchEmail("")
        } catch (error) {
            alert('Invalid Email, user not found.');
            console.error(error);
        }
    };


    const serachNote = async (query) => {
        try {
            const response = await axiosInstace.get('/search-note/', {
                params: { query }
            })

            if (response.data && response.data.isMatch) {
                setIsSearch(true);
                setAllNotes(response.data.isMatch);
            }

            if (response.data && response.data.deleted) {
                getAllNotes();
            }
        } catch (err) {
            console.log(err)
        }
    }

    const updatePinNote = async (noteData) => {

        try {
            const noteId = noteData._id;
            const response = await axiosInstace.put('/isPinned-note/' + noteId, {
                isPinned: !noteData.isPinned
            });

            if (response.data && response.data.updatedNote) {
                getAllNotes();
            }
        } catch (err) {
            console.log(err)
        }
    };

    const archiveNote = async (noteData) => {

        try {
            const noteId = noteData._id;
            const response = await axiosInstace.put('/archive-notes/' + noteId, {
                isArchived: true
            });

            if (response.data && response.data.archiveNote) {
                getAllNotes();
                getArchivedNotes();
            }
        } catch (err) {
            console.log(err)
        }
    };

    const restoreNote = async (noteData) => {

        try {
            const noteId = noteData._id;
            const response = await axiosInstace.put('/restore-notes/' + noteId, {
                isArchived: false
            });

            if (response.data && response.data.archiveNote) {
                getAllNotes();
                getArchivedNotes();
            }
        } catch (err) {
            console.log(err)
        }
    };

    const acceptMsg = async (ID) => {
        try {
            const update = await axiosInstace.put(`/status-changer/${ID}`, { status: 'accepted' })
            if (update.data && update.data.updateStatus) {
                getRecivedNotes();
            }
        } catch (err) {
            console.log(err)
        }
    }


    const handleClearSearch = () => {
        setIsSearch(false);
        getAllNotes();
    }

    const handleReminderModal = (id) => {
        setOpenReminderModal({ isShown: true });
        setNoteId(id);
    }


    useEffect(() => {
        getUserInfo();
        getAllNotes();
        getReminderNotes();
        getArchivedNotes();
        getRecivedNotes();
    }, []);

    const handleClick = (id) => {
        if (id === 1) {
            setClicked2(false);
            setClicked3(false);
            setClicked4(false)
            setClicked5(false)
            setClicked1(!clicked1);
            getReminderNotes();
        } else if (id === 2) {
            setClicked1(false);
            setClicked3(false);
            setClicked4(false);
            setClicked5(false);
            setClicked2(!clicked2);
        } else if (id === 3) {
            setClicked1(false);
            setClicked2(false);
            setClicked4(false);
            setClicked5(false);
            setClicked3(!clicked3);
        }
        else if (id === 4) {
            setClicked1(false);
            setClicked2(false);
            setClicked3(false);
            setClicked5(false);
            setClicked4(!clicked4);
        }
        else if (id === 5) {
            setClicked1(false);
            setClicked2(false);
            setClicked3(false);
            setClicked4(false);
            setClicked5(!clicked5);
        }
    }
    return (
        <>
            <Navbar userInfo={userInfo} onSearch={serachNote} onClearSearch={handleClearSearch} clicked={clicked3} />
            <div className="border-2 border-l-0 border-t-0 bg-white border-r-gray-300 mt-20 pt-5 gap-2 h-full w-1/5 flex flex-col fixed">
                <div className="flex justify-between items-center">
                    <button className={`h-15 w-full flex gap-4 items-center pl-8 cursor-pointer`} onClick={() => { handleClick(3) }} disabled={clicked3}><NotepadText /> Notes</button>{clicked3 && <ChevronRight />}
                </div>
                <div className="flex justify-between items-center">
                    <button className={`h-15 w-full flex gap-4 items-center pl-8 cursor-pointer`} onClick={() => { handleClick(1) }} disabled={clicked1}><BellRing /> Reminders</button>{clicked1 && <ChevronRight />}
                </div>
                <div className="flex justify-between items-center">
                    <button className={`h-15 w-full flex gap-4 items-center pl-8 cursor-pointer`} onClick={() => { handleClick(4) }} disabled={clicked4}><PersonStanding /> Collbraters</button>{clicked4 && <ChevronRight />}
                </div>
                <div className="flex justify-between items-center">
                    <button
                        className="h-15 w-full flex gap-4 items-center pl-8 cursor-pointer"
                        onClick={() => { handleClick(5) }}
                        disabled={clicked5}
                    >
                        <Mails /> Recived Notes
                    </button>
                    {clicked5 && <ChevronRight />}
                </div>
                <div className="flex justify-between items-center">
                    <button className={`h-15 w-full flex gap-4 items-center pl-8 cursor-pointer`} onClick={() => { handleClick(2) }} disabled={clicked2}><Shredder /> Archive</button>{clicked2 && <ChevronRight />}
                </div>
            </div>
            <div className="flex flex-wrap w-3/4 pt-20 gap-5 gap-x-10 ml-90">
                {clicked3 && (
                    <>
                        {allNotes.map((item) => (
                            <NoteCard
                                key={item._id}
                                content={item.content}
                                PinnedOrNot={item.isPinned}
                                date={moment(item.createdOn).format("DD MMM, YYYY")}
                                title={item.title}
                                tags={item.tags}
                                selectedColor={item.selectedColor}
                                onDelete={() => archiveNote(item)}
                                onEdit={() => handleEdit(item)}
                                getAllNotes={getAllNotes}
                                isPinned={() => updatePinNote(item)}
                                reminder={() => handleReminderModal(item._id)}
                            />
                        ))}
                        <button
                            className="w-16 h-auto p-5 text-white bg-blue-500 hover:bg-blue-400 rounded-xl fixed bottom-10 right-10"
                            onClick={() =>
                                setOpenAddEditModal({ isShown: true, type: "add", data: null })
                            }
                        >
                            <Plus />
                        </button>
                    </>
                )}

                {clicked1 && (
                    <div className="flex flex-wrap w-3/4 gap-15 mt-5 ml-5">
                        {Rnotes.map((item) => (
                            <NoteCard
                                type={"reminder"}
                                key={item._id}
                                date={moment(item.createdOn).format("DD MMM, YYYY")}
                                title={item.title}
                                onDelete={() => deleteNote(item._id)}
                                onEdit={() => handleEdit(item)}
                                reminderDate={moment(item.reminderDate).format("DD MMM, YYYY")}
                                reminderTime={item.reminderTime}
                                reminder={() => handleReminderModal(item._id)}
                                deleteReminder={() => deleteReminder(item._id)}
                            />
                        ))}
                    </div>
                )}

                {clicked4 && (

                    <div className="flex flex-col items-center justify-center m-5 -mt-10 w-full min-h-screen ">
                        <div className="w-full bg-white shadow-xl rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                                ✉️ Send a Note
                            </h2>
                            {/* Search Email */}
                            <div className="mb-5 w-1/3 relative">
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Recipient Email
                                </label>
                                <div className="flex items-center border-2 border-gray-300 rounded-xl focus-within:border-blue-500 transition">
                                    <input
                                        type="email"
                                        placeholder="Enter recipient's email"
                                        value={searchEmail}
                                        onChange={(e) => setSearchEmail(e.target.value)}
                                        className="flex-1 px-4 py-2 outline-none bg-transparent text-gray-800"
                                    />
                                    <Search className="text-gray-400 mr-3" size={20} />
                                </div>
                            </div>

                            {/* Title Input */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter note title"
                                    value={sendTitle}
                                    onChange={(e) => setSendTitle(e.target.value)}
                                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            {/* Content Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Content
                                </label>
                                <textarea
                                    placeholder="Write your note here..."
                                    rows="5"
                                    value={sendContent}
                                    onChange={(e) => setSendContent(e.target.value)}
                                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition resize-none"
                                />
                                <input type="text" value={sentBy} className="hidden" />
                            </div>

                            {/* Send Button */}
                            <button
                                onClick={sendNotes}
                                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2.5 rounded-xl shadow-md transition-all duration-300"
                            >
                                <Send size={18} />
                                Send Note
                            </button>
                        </div>
                    </div>

                )}

                {clicked5 && (
                    <>
                        <div className="mt-5 w-full h-auto pr-8">
                            <p className="text-2xl p-5 underline">Requests</p>
                            <div className="w-full h-44 rounded-2xl border-2 overflow-y-scroll p-4 border-gray-400 shadow-lg hover:shadow-xl">
                                {receviedNotes.length > 0 ? (
                                    receviedNotes.filter(item => item.status === 'pending').map((item, index) => (
                                        <div key={index} className="w-full h-fit flex justify-between items-center border-2 border-gray-100 shadow-lg rounded-xl mt-3 p-2 px-5">
                                            <h2 className="text-lg text-gray-400">Message Sent by : <span className="text-black text-xl">{item.sentBy}</span></h2>
                                            <div className="flex gap-3">
                                                <button className="w-20 h-10 bg-blue-500 flex items-center justify-center text-white rounded-lg p-1 cursor-pointer" onClick={() => acceptMsg(item._id)}><MessageSquarePlus /></button>
                                                <button className="w-20 h-10 bg-red-500 flex items-center justify-center text-white rounded-lg p-1 cursor-pointer" onClick={() => deleteMsg(item._id)}><X /></button>
                                            </div>
                                        </div>
                                    )
                                    ))
                                    : (
                                        <p className="text-gray-600 text-center w-full mt-10">No Requests recevied</p>
                                    )}
                            </div>
                        </div>
                        <div className="flex flex-wrap w-3/4 gap-15 mt-2 ml-5">
                            {receviedNotes.length > 0 ? (
                                receviedNotes.filter(item => item.status === 'accepted').map((item, index) => (

                                    <div
                                        key={item._id}
                                        className="w-2/7 h-fit mt-5 border-4 border-[#454545] rounded-xl hover:shadow-2xl space-y-2"
                                    >
                                        <svg width="20" height="80" className="w-full -mt-1.5 m-0 p-0" viewBox="0 0 266 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.3136 4.43256L134.508 73.4326L263.314 4.43256" stroke="#454545" stroke-width="10" />
                                        </svg>
                                        <div className="w-full p-5 -mt-2  h-auto flex justify-between pb-3 items-start gap-6">
                                            <div className="flex flex-col justify-start gap-3">
                                                <h4>{item.sendTitle}</h4>
                                                <p className="text-sm  text-gray-400 py-2 ">Sent By :{item.sentBy}</p>
                                                <p>Title : {item.title}</p>
                                                <p className="text-sm py-2 ">content : <br />{item.content}</p>
                                            </div>
                                        </div>
                                        <div className="px-1 flex justify-between items-center">


                                            <div className="w-full h-auto flex m-2 ml-4">
                                                <button
                                                    className="w-full h-auto flex cursor-pointer mb-2 justify-end rounded-lg text-gray-500"
                                                    onClick={() => deleteMsg(item._id)}
                                                >
                                                    <Trash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600 text-center ml-[20%] w-full mt-15">
                                    No notes Recived.
                                </p>
                            )}
                        </div>
                    </>
                )}

                {clicked2 && (
                    <div className="flex flex-wrap w-3/4 gap-15 mt-5 ml-5">
                        {archivedNotes.length > 0 ? (
                            archivedNotes.map((item) => (
                                <div
                                    key={item._id}
                                    className="w-2/7 h-fit mt-5 border-2 p-5 border-gray-300 rounded-xl hover:shadow-2xl space-y-5"
                                >
                                    <div className="w-full px-5 h-auto flex justify-between pb-3 items-start gap-6">
                                        <div className="flex flex-col justify-start gap-2">
                                            <h4>{item.title}</h4>
                                            <p className="text-slate-500 text-sm">{moment(item.createdOn).format("DD MMM, YYYY")}</p>
                                            <p className="text-sm py-2 ">{item.content}</p>
                                        </div>
                                    </div>
                                    <div className="px-1 flex justify-between items-center">
                                        <div className="flex w-full flex-wrap items-center gap-2">
                                            {item.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className={`rounded-2xl ${item.selectedColor} border-2 p-1 px-2`}
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="w-full h-auto flex pt-2 ml-4">
                                            <button
                                                className="w-full h-auto flex  cursor-pointer p-1 mb-2 justify-center rounded-lg text-gray-500"
                                                onClick={() => restoreNote(item)}
                                            >
                                                <RotateCcw />
                                            </button>
                                            <button
                                                className="w-full h-auto flex cursor-pointer  p-1 mb-2 justify-center rounded-lg text-gray-500"
                                                onClick={() => deleteNote(item._id)}
                                            >
                                                <Trash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center w-full mt-10">
                                No archived notes found.
                            </p>
                        )}
                    </div>
                )}


                <Modal
                    isOpen={openAddEditModal.isShown}
                    onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
                    style={{
                        overlay: { backgroundColor: "rgba(0,0,0,0.2)" },
                        content: { width: '50%', height: 'fit-content', margin: 'auto', borderRadius: '20px' }
                    }}
                    contentLabel="Add or Edit Note"
                >
                    <AddEditNotes
                        onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
                        type={openAddEditModal.type}
                        noteData={openAddEditModal.data}
                        getAllNotes={getAllNotes}
                    />
                </Modal>
                <Modal
                    isOpen={openReminderModal.isShown}
                    onRequestClose={() => setOpenReminderModal({ isShown: false })}
                    style={{
                        overlay: { backgroundColor: "rgba(0,0,0,0.2)" },
                        content: { width: '50%', height: 'fit-content', margin: 'auto', borderRadius: '20px' }
                    }}
                >
                    <div className="flex flex-col justify-center items-start gap-5">
                        <label> Set Date:</label>
                        <input
                            type="date"
                            value={reminderDate}
                            onChange={(e) => setReminderDate(e.target.value)}
                            className="outline-none w-full h-10 border-2 border-gray-300 rounded-lg p-5"
                        />
                        <label> Set Time:</label>
                        <input
                            type="time"
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            className="outline-none w-full h-10 border-2 border-gray-300 rounded-lg p-5"
                        />
                        <button
                            disabled={!reminderDate || !reminderTime}
                            onClick={async () => {
                                try {
                                    await axiosInstace.put(`/set-reminder/${noteId}`, { reminderDate, reminderTime });
                                    alert("Reminder set successfully!");
                                    setOpenReminderModal({ isShown: false });
                                    setReminderDate("");
                                    setReminderTime("");
                                } catch (err) {
                                    console.error(err);
                                    alert("Failed to set reminder.");
                                }
                            }}
                            className="w-full h-12 rounded-lg mt-2 bg-blue-500 hover:bg-blue-400 text-white">
                            Set Reminder
                        </button>
                    </div>
                </Modal >
            </div >
            {(allNotes.length === 0 && clicked3) ? <div className="w-full mx-auto mt-10 flex flex-col items-center justify-center p-10 ">
                <div className="flex items-center pb-5">
                    <span className="w-52 h-auto text-gray-800 mx-auto"><ScrollText size={300} strokeWidth={1.5} /></span>
                    <span className="w-fit h-auto rounded-full text-white bg-gray-800 mt-28 ml-5"><CirclePlus size={70} /></span>
                </div>
                <h3 className="text-center text-2xl">No Note Found :'( <br /> You can create a new note from the '+' below!</h3>
            </div> : null}
        </>
    );
};

export default Home;


