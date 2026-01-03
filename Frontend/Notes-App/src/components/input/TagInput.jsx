import { Plus, X } from 'lucide-react'
import react, { useState } from 'react'

const TagInput = ({ tags, setTags, colorClasses }) => {

    const [tagInput, SetTagInput] = useState('')

    const handleTagInput = (e) => {
        SetTagInput(e.target.value);
    }
    const addNewtag = () => {
        if (tagInput !== '') {
            setTags([...tags, tagInput.trim()]);
            SetTagInput("");
        }
    }
    const handlekeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addNewtag()
            SetTagInput("")
        }
    }
    const removeTag = (key) => {
        setTags(tags.filter((_, i) => i !== key))
    }
    return (
        <>
            <div className='flex justify-start items-center -mt-1 gap-5'>
                <input type="text" className='outline-none border-2 w-62 h-10 pl-2 border-slate-400 text-sm rounded-xl' placeholder='Add Tag' value={tagInput} onChange={handleTagInput} onKeyDown={handlekeyDown} />
                <div>
                    <button className='w-8 h-8 text-center pl-1 text-white bg-blue-500 hover:bg-blue-400 rounded-sm' onClick={addNewtag}><Plus /></button>
                </div>
            </div>
            {tags.length <= 0 ? null :
                <div className='flex flex-wrap gap-2 items-center mt-2'>
                    {tags.map((tags, index) => (
                        <span className={`${colorClasses} rounded-xl p-2 text-center flex items-center gap-2`} key={index}>#{tags}
                            <button className='text-sm cursor-pointer' onClick={() => { removeTag(index) }}><X /></button>
                        </span>
                    ))}
                </div>}
        </>
    )
}

export default TagInput