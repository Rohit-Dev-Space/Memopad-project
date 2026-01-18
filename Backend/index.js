require('dotenv').config()

const config = require('./config.json')
const mongoose = require('mongoose')
const User = require('./models/user.models')
const Notes = require('./models/note.model')
const sentNotes = require('./models/sent-note.model')
const cron = require("node-cron");
const moment = require("moment");
const { authenticateTokens, sendReminderEmail } = require('./utilites');
const PORT = process.env.PORT || 5000;

const express = require('express')
const app = express()
const cors = require('cors')
const bcrypt = require('bcrypt')

mongoose.connect(process.env.MONGO_URI)

app.use(cors({
    origin: 'https://memopad-project.vercel.app',
    methods: ['GET', 'PUT', 'DELETE', 'POST'],
    allowedHeaders: ["Content-Type", "Authorization"],
}))
app.options('*', cors());
app.use(express.json())
const jwt = require('jsonwebtoken')
const sentNoteModel = require('./models/sent-note.model')
app.get('/', (req, res) => {
    res.json({ data: 'hello' })
})

//fetching info from form req.body and checking for any missing value

app.post('/create-account', async (req, res) => {
    const { fullName, email, password } = req.body

    if (!fullName) {
        return res.status(400).json({ error: true, message: 'Full name is required' })
    }
    if (!email) {
        return res.status(400).json({ error: true, message: 'Email is required' })
    }
    if (!password) {
        return res.status(400).json({ error: true, message: 'Password is required' })
    }

    //checking for already existing user

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({ message: 'User already exists' })
    }

    //creating account
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name: fullName,
        email,
        password: hashedPassword
    })

    await user.save()

    const accessToken = jwt.sign({ id: user.id, user: user.name, email: user.email }, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: '60m'
    })

    return res.json({
        message: 'Registered succesfully',
        user,
        accessToken
    })
})

app.post('/login-account', async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(400).json({ error: true, message: 'Email is required' })
    }
    if (!password) {
        return res.status(400).json({ error: true, message: 'Password is required' })
    }

    //checking for already existing user

    const isUser = await User.findOne({ email: email });

    if (!isUser) {
        return res.status(400).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, isUser.password)

    if (isUser.email === email && isMatch) {
        const accessToken = jwt.sign({ id: isUser.id, user: isUser.name, email: isUser.email }, process.env.SECRET_ACCESS_TOKEN, {
            expiresIn: '60m'
        })

        return res.json({
            message: 'Logined succesfully',
            accessToken,
            isUser
        })
    }
})

app.post('/add-note', authenticateTokens, async (req, res) => {

    try {
        const { title, content, tags, selectedColor } = req.body
        const { id } = req.user

        if (!title) {
            return res.status(400).json({ message: 'Title is required' })
        }

        const note = new Notes({
            title,
            content,
            tags: tags || [],
            userId: id,
            selectedColor: selectedColor
        })

        await note.save()

        return res.json({
            messgae: 'Note added',
            note
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal error', err: error })
    }
})

app.put('/set-reminder/:noteId', authenticateTokens, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const { reminderDate, reminderTime } = req.body;

        if (!reminderDate || !reminderTime) {
            return res.status(400).json({ error: true, message: 'Both date and time are required' });
        }

        const updatedNote = await Notes.findByIdAndUpdate(
            noteId,
            { reminderDate, reminderTime, isReminderActive: true },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({ message: 'Reminder set successfully', note: updatedNote });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.put('/edit-note/:noteId', async (req, res) => {

    try {
        const noteId = req.params.noteId
        const { title, content, tags, isPinned, selectedColor } = req.body

        if (!title) {
            return res.status(400).json({ error: true, message: 'Title is required' })
        }
        if (!content) {
            return res.status(400).json({ error: true, message: 'Content is required' })
        }
        //checking for already existing user

        const updatedNote = await Notes.findOneAndUpdate({ _id: noteId }, { title: title, content: content, tags: tags || [], isPinned: isPinned || false, selectedColor: selectedColor }, { new: true });

        if (!updatedNote) {
            return res.status(400).json({ message: 'User not found' })
        }

        return res.json({
            message: 'Updated succesfully',
            updatedNote
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.put('/delete-reminder/:noteId', async (req, res) => {

    try {
        const noteId = req.params.noteId
        const { reminderDate, reminderTime, isReminderActive } = req.body

        const deletedReminder = await Notes.findOneAndUpdate({ _id: noteId }, { reminderDate: reminderDate, reminderTime: reminderTime, isReminderActive: isReminderActive }, { new: true });

        if (!deletedReminder) {
            return res.status(400).json({ message: 'User not found' })
        }

        return res.json({
            message: 'Updated succesfully',
            deletedReminder
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.get('/getAll-notes', authenticateTokens, async (req, res) => {

    try {
        const { id } = req.user
        const getAll = await Notes.find({ userId: id, isArchived: false }).sort({ isPinned: -1 })

        return res.status(200).json({ message: 'retrived all notes', getAll })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.get('/get-users', authenticateTokens, async (req, res) => {

    try {
        const { id } = req.user
        const getUser = await User.findOne({ _id: id })

        return res.status(200).json({ message: 'retrived user', user: getUser })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.get('/get-reminder', authenticateTokens, async (req, res) => {

    try {
        const { id } = req.user
        const reminderNotes = await Notes.find({
            userId: id,
            isReminderActive: true,
        }).sort({ reminderDate: 1 });
        return res.status(200).json({ message: 'retrived user', reminder: reminderNotes })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.delete('/delete-notes/:noteId', authenticateTokens, async (req, res) => {

    try {
        const noteId = req.params.noteId;
        const deleteNote = await Notes.deleteOne({ _id: noteId })

        if (!deleteNote) {
            return res.status(401).json({ message: 'id not found' })
        }

        return res.status(200).json({ message: 'Deleted The note', deleted: true })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.put('/archive-notes/:noteId', authenticateTokens, async (req, res) => {

    try {
        const noteId = req.params.noteId;
        const { isArchived } = req.body

        const archiveNote = await Notes.findByIdAndUpdate({ _id: noteId }, { isArchived: isArchived })

        if (!archiveNote) {
            return res.status(401).json({ message: 'id not found' })
        }

        return res.status(200).json({ message: 'Archived The note', archiveNote })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.put('/restore-notes/:noteId', authenticateTokens, async (req, res) => {

    try {
        const noteId = req.params.noteId;
        const { isArchived } = req.body

        const archiveNote = await Notes.findByIdAndUpdate({ _id: noteId }, { isArchived: isArchived })

        if (!archiveNote) {
            return res.status(401).json({ message: 'id not found' })
        }

        return res.status(200).json({ message: 'Restored The note', archiveNote })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.get('/archive-notes', authenticateTokens, async (req, res) => {

    try {

        const archivedNotes = await Notes.find({ isArchived: true })

        if (!archivedNotes) {
            return res.status(401).json({ message: 'archived notes not found' })
        }

        return res.status(200).json({ message: 'Archived The note', archivedNotes })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//update pinned only
app.put('/isPinned-note/:pinnedId', authenticateTokens, async (req, res) => {
    try {
        const pinnedId = req.params.pinnedId
        const { isPinned } = req.body

        if (typeof isPinned === "undefined") {
            return res.status(400).json({ error: true, message: 'Pinned boolean is required' })
        }

        const updatedNote = await Notes.findOneAndUpdate({ _id: pinnedId }, { isPinned: isPinned || false }, { new: true });

        if (!updatedNote) {
            return res.status(400).json({ message: 'User not found' })
        }

        return res.json({
            message: 'Pinning Updated succesfully',
            updatedNote
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.put('/status-changer/:id', authenticateTokens, async (req, res) => {
    try {
        const id = req.params.id
        const { status } = req.body
        const updateStatus = await sentNotes.findByIdAndUpdate({ _id: id }, { status: status })
        return res.json({ message: 'Status updated to accepted', updateStatus })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//search notes by title 
app.get('/search-note', authenticateTokens, async (req, res) => {

    const { id } = req.user;
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: true, message: 'Title is required' })
    }

    try {
        const isMatch = await Notes.find({
            userId: id,
            $or: [
                { title: { $regex: new RegExp(query, 'i') } },
                { content: { $regex: new RegExp(query, 'i') } },
                { tags: { $regex: new RegExp(query, 'i') } }
            ],
        })
        return res.json({
            message: 'Serach working succesfully',
            isMatch
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.post('/send-note', authenticateTokens, async (req, res) => {
    try {
        const { sendTitle, sendContent, sentBy, searchEmail } = req.body;
        const { id } = req.user;

        // ✅ Check if recipient exists
        const recipient = await User.findOne({ email: searchEmail });
        if (!recipient) {
            return res.status(400).json({ message: 'Recipient not found' });
        }

        // ✅ Create a new sent note entry
        const note = new sentNotes({
            userId: id,
            sentBy,
            reciverEmail: searchEmail,
            title: sendTitle,
            content: sendContent,
        });

        await note.save();

        res.status(200).json({
            message: 'Note sent successfully!',
            note
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal error', error });
    }
});


app.get('/get-sentNotes', authenticateTokens, async (req, res) => {
    try {
        const { email } = req.user
        const getnotes = await sentNotes.find({ reciverEmail: email })

        return res.json({
            messgae: 'Note recived',
            getnotes
        })
    } catch {
        res.status(500).json({ message: 'Internal error', err: error })
    }
})

app.delete('/delete-message/:msgId', authenticateTokens, async (req, res) => {
    try {
        const msgId = req.params.msgId
        const deleteMsg = await sentNotes.deleteOne({ _id: msgId })
        if (!deleteMsg) {
            return res.status(401).json({ message: 'id not found' })
        }

        return res.status(200).json({ message: 'Deleted The note', deleted: true })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// 🕒 Check reminders every minute
cron.schedule("* * * * *", async () => {
    const now = moment().format("YYYY-MM-DD HH:mm");
    const activeReminders = await Notes.find({ isReminderActive: true });

    for (const note of activeReminders) {
        const noteDateTime = `${note.reminderDate} ${note.reminderTime}`;

        // If it's the scheduled time
        if (moment(noteDateTime).isSame(now, "minute")) {
            const user = await User.findById(note.userId);
            if (user && user.email) {
                await sendReminderEmail(
                    user.email,
                    "Reminder from Notes App",
                    `🕒 Reminder: ${note.title}\n\n${note.content}`
                );

                // Turn off reminder after sending
                note.isReminderActive = false;
                await note.save();
                console.log(`Reminder sent to ${user.email} for note: ${note.title}`);
            }
        }
    }
});


app.listen(PORT, () => {
    console.log('Server is running on http://localhost:5000')
})

module.exports = app;