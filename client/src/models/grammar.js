class GrammarRule {
    constructor(...args) {
        try {
            this.value = this.validate(args);  
        } catch (e) {
            console.error(e);
        }
    }

    validate(elements) {
        var result = [];

        elements.forEach((element) => {
            if (typeof(element) === 'string') {
                result.push(new FixedString(element, true));
            } else if (element instanceof WordInGrammar) {
                result.push(element);
            } else {
                
                throw new Error('Invalid grammar element.');
            }
        });

        return result;
    }

    convertToDictList() {
        return this.value.map((element) => { return element.convertToDict() })
    }
}

class WordInGrammar {
    constructor(screenText, fixed) {
        this.screenText = screenText;
        this.fixed = fixed;
    }

    convertToDict() {
        return {
            "screen-text": this.screenText,
            "fixed": this.fixed,
            "type": this.type
        }
    }
}

class Verb extends WordInGrammar {
    constructor(screenText, fixed) {
        super(screenText, fixed);
        this.abbreviation = "V.";
        this.type = "verb";
    }
}

class Noun extends WordInGrammar {
    constructor(screenText, fixed) {
        super(screenText, fixed);
        this.abbreviation = "N.";
        this.type = "noun";
    }
}

class Adjective extends WordInGrammar {
    constructor(screenText, fixed) {
        super(screenText, fixed);
        this.abbreviation = "Adj.";
        this.type = "adjective";
    }
}

class Adverb extends WordInGrammar {
    constructor(screenText, fixed) {
        super(screenText, fixed);
        this.abbreviation = "Adv.";
        this.type = "adverb";
    }
}

class FixedString extends WordInGrammar {
    constructor(screenText, fixed) {
        super(screenText, fixed);
        this.abbreviation = "Str.";
        this.type = "string";
    }
}

export { GrammarRule, Verb, Noun, Adjective, Adverb, FixedString };