export const validator = (email) => {
    const regexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regexp.test(email);
}

export const validator2 = (name) => {
    const regexp = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    return regexp.test(name);
}

export const passLength = (password) => {
    const regexp = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{5,}$/
    return regexp.test(password)
}

export const initialsGenerator = (name) => {
    const word = name.trim().split(" ")
    if (word.length === 1) {
        let initials = word[0][0].trim().toUpperCase()
        return initials.toUpperCase();
    } else {
        const word1 = word[0][0]
        const word2 = word[1][0]
        let initials = word1 + word2
        return initials.toUpperCase();
    }

}
