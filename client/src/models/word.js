class Word {
    constructor(word, translation, level, example, note=null, time=null) {
        this.word = word;
        this.translation = translation;
        this.level = level;
        this.example = example;
        this.note = note;
        
        const currentYear = new Date().getFullYear().toString();
        this.time = currentYear === time.slice(-4) ? time.slice(0, -6) : time;
    }
}

export default Word;