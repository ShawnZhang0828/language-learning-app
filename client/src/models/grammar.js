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

        elements.forEach(element => {
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
}

class WordInGrammar {
    constructor(screenText, fixed) {
        this.screenText = screenText;
        this.fixed = fixed;
    }
}

class Verb extends WordInGrammar {
    constructor(screenText, fixed) {
        super(screenText, fixed);
        this.abbreviation = "V.";
    }
}

class Noun extends WordInGrammar {
    constructor(screenText, fixed) {
        super(screenText, fixed);
        this.abbreviation = "N.";
    }
}

class Adjective extends WordInGrammar {
    constructor(screenText, fixed) {
        super(screenText, fixed);
        this.abbreviation = "Adj.";
    }
}

class Adverb extends WordInGrammar {
    constructor(screenText, fixed) {
        super(screenText, fixed);
        this.abbreviation = "Adv.";
    }
}

class FixedString extends WordInGrammar {
    constructor(screenText, fixed) {
        super(screenText, fixed);
        this.abbreviation = "Str.";
    }
}

export { GrammarRule, Verb, Noun, Adjective, Adverb, FixedString };